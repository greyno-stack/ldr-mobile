import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import Toast from "react-native-toast-message";

export const useNoteStore = create((set, get) => ({
  notes: [],
  isLoading: true,
  isSending: false,

  getNotes: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/notes");
      set({ notes: res.data.notes });
    } catch (error) {
      console.error("Error getting notes:", error);
      set({ notes: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  sendNote: async (text) => {
    set({ isSending: true });
    try {
      await axiosInstance.post("/notes", { text });
      Toast.show({ type: "success", text1: "Note sent!" });
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to send note";
      Toast.show({ type: "error", text1: message });
      return false;
    } finally {
      set({ isSending: false });
    }
  },

  dismissNote: async (id) => {
    const previousNotes = get().notes;
    set({ notes: previousNotes.filter((note) => note.id !== id) });
    try {
      await axiosInstance.patch(`/notes/${id}/dismiss`);
    } catch (error) {
      console.error("Error dismissing note:", error);
      set({ notes: previousNotes });
      Toast.show({ type: "error", text1: "Couldn't remove note" });
    }
  },
}));
