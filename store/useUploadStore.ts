import { create } from "zustand";
import axios from "axios";

interface ImageStore {
  generatedImages: string[];
  uploadImages: (
    images: { base64Image: string; title: string }[],
    userId: string
  ) => Promise<void>;
}

export const useUploadStore = create<ImageStore>((set) => ({
  generatedImages: [],

  uploadImages: async (images, userId) => {
    try {
      const response = await axios.post("/api/upload-image", {
        userId: userId, // Replace with actual user ID
        prompt: "yourPrompt", // Replace with actual prompt
        modelId: "modelId", // Replace with actual modelId
        width: 512, // Example width
        height: 512, // Example height
        images,
      });

      if (response.data.success) {
        set({ generatedImages: response.data.urls });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  },
}));
