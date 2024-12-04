import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserState {
  credits: number | null;
  fetchCredits: () => Promise<void>;
  deductCredits: (numberOfImages: number, model: string) => Promise<void>;
}

export const userCreditsStore = create<UserState>()(
  devtools((set) => ({
    credits: null,
    fetchCredits: async () => {
      try {
        const response = await axios.get("/api/user/credits");
        set({ credits: response.data.credits });
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    },
    deductCredits: async (numberOfImages, model) => {
      try {
        const response = await axios.post("/api/user/credits/deduct", {
          numberOfImages,
          model,
        });

        set((state) => ({
          credits: response.data.credits,
        }));
      } catch (error) {
        console.error("Error deducting credits:", error);
      }
    },
  }))
);
