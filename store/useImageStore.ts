import { create } from "zustand";

interface ImageState {
  currentImage: string | undefined;
  generatedImages: string[];
  setCurrentImage: (image: string) => void;
  addGeneratedImages: (images: string[]) => void;
  clearGeneratedImages: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  currentImage: undefined,
  generatedImages: [],

  // Set current image
  setCurrentImage: (image) => set({ currentImage: image }),

  // Add generated images to state and set the first one as current
  addGeneratedImages: (images) =>
    set((state) => ({
      generatedImages: [...state.generatedImages, ...images],
      currentImage: images[0],
    })),

  // Clear all images from the state
  clearGeneratedImages: () =>
    set({ generatedImages: [], currentImage: undefined }),
}));
