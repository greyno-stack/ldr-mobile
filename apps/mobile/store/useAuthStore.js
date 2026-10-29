import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance, setAuthToken } from "../lib/axios.js";
import Toast from "react-native-toast-message";

const AUTH_STORAGE_KEY = "authUser";

const persistAuthUser = (authUser) => {
    if (authUser) {
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    } else {
        AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
};

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isVerifying: false,
    isResending: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
            if (!stored) {
                set({ authUser: null, isCheckingAuth: false });
                return;
            }

            const storedAuthUser = JSON.parse(stored);
            setAuthToken(storedAuthUser.token);

            const res = await axiosInstance.get("/auth/check");
            const authUser = { ...storedAuthUser, ...res.data };
            persistAuthUser(authUser);
            set({ authUser });
        }
        catch (error) {
            console.error("Error checking auth:", error);
            setAuthToken(null);
            persistAuthUser(null);
            set({authUser: null});
        }
        set({ isCheckingAuth: false });
    },

    // Starts email verification; the account is only created once verifyEmail succeeds.
    signup: async(data) => {
        set({isSigningUp: true});
        try {
            await axiosInstance.post("/auth/signup", data);
            return true;
        }
        catch (error) {
            const message =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              error?.message ||
              "Signup failed";
            if (message === "User already exists") {
                Toast.show({
                type: "error",
                text1: "Email already in use",
                text2: "Try signing in instead, or use a different email.",
            });
            } else {
                Toast.show({ type: "error", text1: message });
            }
            console.error("Error signing up:", error);
            return false;
        }
        finally {
            set({isSigningUp: false});
        }
    },

    verifyEmail: async({ email, code }) => {
        set({ isVerifying: true });
        try {
            const res = await axiosInstance.post("/auth/verify-email", { email, code });
            setAuthToken(res.data.token);
            persistAuthUser(res.data);
            set({ authUser: res.data });
            return true;
        }
        catch (error) {
            const message =
              error?.response?.data?.error ||
              error?.message ||
              "Verification failed";
            Toast.show({ type: "error", text1: message });
            return false;
        }
        finally {
            set({ isVerifying: false });
        }
    },

    // Resolves to { success, retryAfterSeconds? } so the screen can sync its cooldown timer.
    resendCode: async(email) => {
        set({ isResending: true });
        try {
            await axiosInstance.post("/auth/resend-code", { email });
            Toast.show({ type: "success", text1: "New code sent" });
            return { success: true };
        }
        catch (error) {
            const message =
              error?.response?.data?.error ||
              error?.message ||
              "Couldn't resend the code";
            Toast.show({ type: "error", text1: message });
            return { success: false, retryAfterSeconds: error?.response?.data?.retryAfterSeconds };
        }
        finally {
            set({ isResending: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            setAuthToken(res.data.token);
            persistAuthUser(res.data);
            set({ authUser: res.data });
            Toast.show({ type: "success", text1: "Logged in successfully" });
            return true;
            // get().connectSocket();
        } catch (error) {
            const status = error?.response?.status;
            const message =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              error?.message ||
              "Sign in failed";
            if (status === 401) {
                Toast.show({type: "error", text1: "Invalid email or password",
            });
            } else {
                Toast.show({ type: "error", text1: message });
            }
            console.error("Error logging in:", error);
            return false;
        }
        finally {
            set({ isLoggingIn: false });
        }
    },


    logout: async(username) => {
        try {
            await axiosInstance.post("/auth/logout");
            setAuthToken(null);
            persistAuthUser(null);
            set({ authUser: null });
            // get().disconnectSocket();
        }
        catch (error) {
            console.error("Error logging out:", error);
        }
    },
}));