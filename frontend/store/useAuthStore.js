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

    signup: async(data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            setAuthToken(res.data.token);
            persistAuthUser(res.data);
            set({authUser: res.data});
            console.log("Signup successful:", res.data);
        }
        catch (error) {
            const status = error?.response?.status;
            const message =
              error?.response?.data?.error ||
              error?.response?.data?.message ||
              error?.message ||
              "Signup failed";
            if (status === 409 || message.toLowerCase().includes("already")) {
                Toast.show({
                type: "error",
                text1: "Email already in use",
                text2: "Try signing in instead, or use a different email.",
            });
            } else {
                Toast.show({ type: "error", text1: message });
            }
            console.error("Error signing up:", error);
        }
        finally {
            set({isSigningUp: false});
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