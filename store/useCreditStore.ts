import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserState {
  credits: number | null;
  fetchCredits: () => Promise<void>;
  deductCredits: (amount: number) => Promise<void>;
}

export const userCreditsStore = create<UserState>()(
  devtools((set) => ({
    credits: null,
    fetchCredits: async () => {
      try {
        const response = await axios.get("/api/user/credits");
        set({ credits: response.data.credits });
      } catch (error) {
        console.error("error fetchinh credits : ", error);
      }
    },
    deductCredits: async (amount) => {
      try {
        const response = await axios.post("/api/user/credits/deduct", {
          amount,
        });
        set((state) => ({
          credits: state.credits !== null ? state.credits - amount : null,
        }));
      } catch (error) {
        console.error("error deducting credits : ", error);
      }
    },
  }))
);
