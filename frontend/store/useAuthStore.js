import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import Toast from "react-native-toast-message";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data});
        }
        catch (error) {
            console.error("Error checking auth:", error);
            set({authUser: null});
        }
        set({ isCheckingAuth: false });
    }, 
    
    signup: async(data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            console.log("Signup successful:", res.data);
        }
        catch (error) {
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
            set({ authUser: res.data });

            // get().connectSocket();
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            set({ isLoggingIn: false });
        }
    },


    logout: async(username) => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            // get().disconnectSocket();
        }
        catch (error) {
            console.error("Error logging out:", error);
        }
    },
}));