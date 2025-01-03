
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Constants
const CACHE_DURATION = 1000; // 5 minutes cache duration

export interface HistoryItem {
  id: number;
  imageUrls: string[]; // Array of image URLs
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

interface FetchState {
  lastFetched: number | null;
  inProgress: boolean;
  userId: string | null;
}

interface HistoryState {
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchState: FetchState;
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  fetchHistory: (userId: string) => Promise<void>;
  setHistory: (history: HistoryItem[]) => void;
}

// Utility function to check cache validity
const isCacheValid = (lastFetched: number | null): boolean => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < CACHE_DURATION;
};

// Custom storage implementation that checks for the browser environment
const createCustomStorage = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Return no-op storage for SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return {
    getItem: (name: string) => {
      try {
        const str = sessionStorage.getItem(name);
        return str ? JSON.parse(str) : null;
      } catch (error) {
        console.error("Error reading from sessionStorage:", error);
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      try {
        sessionStorage.setItem(name, JSON.stringify(value));
      } catch (error) {
        console.error("Error writing to sessionStorage:", error);
      }
    },
    removeItem: (name: string) => {
      try {
        sessionStorage.removeItem(name);
      } catch (error) {
        console.error("Error removing from sessionStorage:", error);
      }
    },
  };
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      isLoading: false,
      error: null,
      fetchState: {
        lastFetched: null,
        inProgress: false,
        userId: null,
      },

      setHistory: (history) => {
        set({ history, error: null });
      },

      addToHistory: (item) => {
        // Ensure imageUrls is always an array
        const normalizedItem = {
          ...item,
          imageUrls: Array.isArray(item.imageUrls)
            ? item.imageUrls
            : [item.imageUrls],
        };

        // Log the item being added for debugging
        console.log("Adding to history:", normalizedItem);

        set((state) => ({
          history: [normalizedItem, ...state.history],
          error: null,
        }));
      },

      removeFromHistory: async (id) => {
        try {
          // Optimistic update
          set((state) => ({
            history: state.history.filter((item) => item.id !== id),
            error: null,
          }));

          // API call can be added here if needed
          // await axios.delete(`/api/image/${id}`);
        } catch (error) {
          // Rollback on error
          const previousHistory = get().history;
          set((state) => ({
            history: previousHistory,
            error: "Failed to delete image",
          }));
          throw error;
        }
      },

      clearHistory: async () => {
        const previousHistory = get().history;

        try {
          set({ history: [], error: null });
          // API call can be added here if needed
          // await axios.delete('/api/image/clear');
        } catch (error) {
          // Rollback on error
          set((state) => ({
            history: previousHistory,
            error: "Failed to clear history",
          }));
          throw error;
        }
      },

      fetchHistory: async (userId) => {
        const state = get();

        if (state.fetchState.inProgress && state.fetchState.userId === userId) {
          return;
        }

        if (
          state.fetchState.userId === userId &&
          isCacheValid(state.fetchState.lastFetched) &&
          state.history.length > 0
        ) {
          return;
        }

        set((state) => ({
          isLoading: true,
          error: null,
          fetchState: {
            ...state.fetchState,
            inProgress: true,
            userId,
          },
        }));

        try {
          const response = await axios.get(`/api/image/fetch-image/${userId}`, {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          });

          if (response.data.images && Array.isArray(response.data.images)) {
            const historyItems: HistoryItem[] = response.data.images.map(
              (imageUrl: string | string[], index: number) => ({
                id: Date.now() + index,
                imageUrls: Array.isArray(imageUrl) ? imageUrl : [imageUrl],
                prompt: "AI Generated Image",
                timestamp: new Date().toISOString(),
                model: "Standard",
                size: "1024x1024",
                quality: "Standard",
                style: "Natural",
              })
            );

            set({
              history: historyItems,
              isLoading: false,
              error: null,
              fetchState: {
                lastFetched: Date.now(),
                inProgress: false,
                userId,
              },
            });
          }
        } catch (error) {
          set((state) => ({
            isLoading: false,
            error: "Failed to fetch history",
            fetchState: {
              ...state.fetchState,
              inProgress: false,
            },
          }));
          throw error;
        }
      },
    }),
    {
      name: "history-storage",
      storage: createCustomStorage(),
    }
  )
);
