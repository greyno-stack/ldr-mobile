import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import Toast from "react-native-toast-message";

export const usePairingStore = create((set, get) => ({
  paired: false,
  partner: null,
  since: null,
  inviteCode: null,
  isLoadingStatus: true,
  isLoadingInvite: false,
  isJoining: false,

  getStatus: async () => {
    set({ isLoadingStatus: true });
    try {
      const res = await axiosInstance.get("/pairing/status");
      set({
        paired: res.data.paired,
        partner: res.data.partner,
        since: res.data.since ?? null,
      });
    } catch (error) {
      console.error("Error getting pairing status:", error);
    } finally {
      set({ isLoadingStatus: false });
    }
  },

  getInviteCode: async () => {
    set({ isLoadingInvite: true });
    try {
      const res = await axiosInstance.get("/pairing/invite");
      set({ inviteCode: res.data.code });
    } catch (error) {
      console.error("Error getting invite code:", error);
      Toast.show({ type: "error", text1: "Couldn't generate invite code" });
    } finally {
      set({ isLoadingInvite: false });
    }
  },

  joinWithCode: async (code) => {
    set({ isJoining: true });
    try {
      await axiosInstance.post("/pairing/join", { code });
      Toast.show({ type: "success", text1: "You're paired!" });
      await get().getStatus(); // refresh status to show partner info
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to join";
      Toast.show({ type: "error", text1: message });
      return false;
    } finally {
      set({ isJoining: false });
    }
  },
}));