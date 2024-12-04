import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Define the video history item type
export interface VideoHistoryItem {
  id: string;
  userId: string;
  prompt: string;
  videoUrl: string;
  timestamp: string;
  model: string;
  duration: string;
  aspectRatio: string;
}

// Store interface
interface VideoHistoryStore {
  videos: VideoHistoryItem[];
  fetchVideoHistory: (userId: string) => Promise<void>;
  addVideoToHistory: (video: VideoHistoryItem) => void;
  clearVideoHistory: () => void;
}

// Create the Zustand store
export const useVideoHistoryStore = create<VideoHistoryStore>()(
  persist(
    (set, get) => ({
      videos: [],

      // Fetch video history for a specific user
      fetchVideoHistory: async (userId: string) => {
        try {
          const response = await axios.get(`/api/kling/fetch-video/${userId}`);
          set({ videos: response.data.videos });
        } catch (error) {
          console.error("Failed to fetch video history", error);
        }
      },

      // Add a video to the history
      addVideoToHistory: (video: VideoHistoryItem) => {
        set((state) => ({
          videos: [video, ...state.videos].slice(0, 20), // Keep last 20 videos
        }));
      },

      // Clear entire video history
      clearVideoHistory: () => {
        set({ videos: [] });
      },
    }),
    {
      name: "video-history-storage", // unique name
      partialize: (state) => ({ videos: state.videos }),
    }
  )
);
