import { HistoryItem } from "@/types";
import { atom } from "recoil";

// Atom for storing generated images
export const generatedImagesState = atom({
  key: "generatedImagesState",
  default: [] as string[],
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const savedImages = localStorage.getItem("generatedImages");
      if (savedImages) {
        setSelf(JSON.parse(savedImages));
      }
    },
  ],
});

// Atom for storing history
export const historyState = atom({
  key: "historyState",
  default: [] as HistoryItem[],
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const savedHistory = localStorage.getItem("history");
      if (savedHistory) {
        setSelf(JSON.parse(savedHistory));
      }
    },
  ],
});
