// store/useHistoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HistoryItem {
  id: number;
  imageUrl: string;
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

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
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history],
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "ai-image-history",
    }
  )
);
