import { create } from "zustand";

export const usePresenceStore = create((set) => ({
  partnerStatus: "offline",
  setPartnerStatus: (status) => set({ partnerStatus: status }),
}));
