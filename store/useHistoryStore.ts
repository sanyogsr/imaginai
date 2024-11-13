import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export interface HistoryItem {
  id: number;
  imageUrls: string[];
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

interface HistoryState {
  history: HistoryItem[];
  isLoading: boolean;
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: number) => void;
  clearHistory: () => void;
  fetchHistory: (userId: string) => Promise<void>;
  setHistory: (history: HistoryItem[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      isLoading: false,

      setHistory: (history) => set({ history }),

      addToHistory: (item) => {
        console.log("Adding to history:", item);
        set((state) => ({
          history: [item, ...state.history],
        }));
      },

      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      clearHistory: () => set({ history: [] }),

      fetchHistory: async (userId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(`/api/image/fetch-image/${userId}`);
          console.log("Raw API response:", response.data);

          if (response.data.images && Array.isArray(response.data.images)) {
            // Transform the array of URLs into HistoryItem objects
            const historyItems: HistoryItem[] = response.data.images.map(
              (imageUrl: string, index: number) => ({
                id: index,
                imageUrls: Array.isArray(imageUrl) ? imageUrl : [imageUrl],
                prompt: "AI Generated Image", // You might want to update this if you have actual prompts
                timestamp: new Date().toLocaleString(),
                model: "Standard", // Default value
                size: "1024x1024", // Default value
                quality: "Standard", // Default value
                style: "Natural", // Default value
              })
            );

            console.log("Transformed history items:", historyItems);
            set({
              history: historyItems,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching history:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "history-storage",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
