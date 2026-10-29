import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import Toast from "react-native-toast-message";

export const useCountdownStore = create((set, get) => ({
  countdown: null,
  isLoading: true,
  isCreating: false,
  isDeleting: false,

  getCountdown: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/countdown");
      set({ countdown: res.data.countdown });
    } catch (error) {
      console.error("Error getting countdown:", error);
      set({ countdown: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createCountdown: async ({ targetDate, title }) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/countdown", { targetDate, title });
      set({ countdown: res.data.countdown });
      Toast.show({ type: "success", text1: "Countdown added" });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to add countdown";
      Toast.show({ type: "error", text1: message });
      return false;
    } finally {
      set({ isCreating: false });
    }
  },

  deleteCountdown: async () => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete("/countdown");
      set({ countdown: null });
      Toast.show({ type: "success", text1: "Countdown removed" });
    } catch (error) {
      console.error("Error deleting countdown:", error);
      Toast.show({ type: "error", text1: "Failed to remove countdown" });
    } finally {
      set({ isDeleting: false });
    }
  },
}));