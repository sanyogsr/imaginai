import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HistoryItem } from "@/types";

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: number) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],

      // Add image to history
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),

      // Remove image from history
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      // Clear history
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "history-storage",
    }
  )
);
export type { HistoryItem };
