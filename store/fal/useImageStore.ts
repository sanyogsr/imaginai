import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface ImageState {
  currentImage: string | undefined;
  generatedImages: {
    urls: string[];
    timestamp: number;
  };
  setCurrentImage: (image: string) => void;
  addGeneratedImages: (images: string[]) => void;
  clearGeneratedImages: () => void;
  fetchUserImages: (userId: string) => Promise<void>;
  downloadCurrentImage: () => void;
  isLoading: boolean;
}

export const useImageStore = create<ImageState>()(
  persist(
    (set, get) => ({
      currentImage: undefined,
      generatedImages: {
        urls: [],
        timestamp: 0,
      },
      isLoading: false,

      setCurrentImage: (image) => set({ currentImage: image }),

      addGeneratedImages: (images) => {
        set((state) => ({
          generatedImages: {
            urls: [...images],
            timestamp: Date.now(),
          },
          currentImage: state.currentImage || images[0],
        }));
      },

      clearGeneratedImages: () =>
        set({
          generatedImages: { urls: [], timestamp: 0 },
          currentImage: undefined,
        }),

      fetchUserImages: async (userId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(`/api/image/fetch-image/${userId}`);
          if (response.data.images) {
            set({
              generatedImages: {
                urls: response.data.images,
                timestamp: Date.now(),
              },
              currentImage: response.data.images[0],
            });
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      downloadCurrentImage: () => {
        const state = get();
        if (state.currentImage) {
          const link = document.createElement("a");
          link.href = state.currentImage;
          link.download = "image.jpg";
          link.click();
        } else {
          console.warn("No image is currently selected for download.");
        }
      },
    }),
    {
      name: "image-storage",
      partialize: (state) => ({
        generatedImages: state.generatedImages,
        currentImage: state.currentImage,
      }),
    }
  )
);
