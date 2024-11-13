// store/useSettingsStore.ts
import { create } from "zustand";

interface SettingsState {
  model: string;
  size: string;
  quality: string;
  style: string;
  numberOfImages: number;
  setNumberOfImages: (count: number) => void;
  updateSetting: (
    key: keyof Omit<
      SettingsState,
      "setNumberOfImages" | "updateSetting" | "numberOfImages"
    >,
    value: string
  ) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  model: "",
  size: "1024x1024",
  quality: "standard",
  style: "natural",
  numberOfImages: 1,
  setNumberOfImages: (count) => set({ numberOfImages: count }),
  updateSetting: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
