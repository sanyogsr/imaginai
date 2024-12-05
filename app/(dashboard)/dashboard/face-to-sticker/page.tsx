"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useCallback } from "react";
import { createFalClient } from "@fal-ai/client";
import {
  ImageGeneration,
  
  AdvancedOptions,
  HistoryItem,
} from "@/types";
import { generateRandomSeed } from "@/utils/utils";
import { PromptInput } from "@/components/fal/dashboard/PromptInput";
import { ImagePreview } from "@/components/fal/dashboard/faceToStickerPreview";
import { userCreditsStore } from "@/store/useCreditStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useImageStore } from "@/store/useImageStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import axios from "axios";
import {  FaceToStickerInput } from "@fal-ai/client/endpoints";

const fal = createFalClient({
  proxyUrl: "/api/fal/proxy",
});

export default function FaceToStickerDashboard() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageGeneration[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageGeneration | null>(
    null
  );
  const { fetchCredits, credits, deductCredits } = userCreditsStore();
  const { addGeneratedImages, clearGeneratedImages } = useImageStore();
  const { addToHistory, fetchHistory } = useHistoryStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { data: session } = useSession();

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    style: "photorealistic",
    aspectRatio: "1:1",
    negativePrompt: "",
    samplingSteps: 20,
    cfgScale: 7,
    seed: null,
    enhancementLevel: "standard",
    numImages: 1,
  });

  // Handle image file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSticker = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please provide a detailed prompt");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    if (credits === null || credits <= 12) {
      toast.error("Please upgrade your plan to get more credits.");
      router.push("/dashboard/upgrade");
      return;
    }

    setLoading(true);
    setError(null);
    clearGeneratedImages();

    try {
      const faceToStickerInput: FaceToStickerInput = {
        image_url: imageUrl,
        prompt,
        image_size: "square_hd",
        negative_prompt: advancedOptions.negativePrompt,
        num_inference_steps: advancedOptions.samplingSteps,
        guidance_scale: advancedOptions.cfgScale,
      };

      const result = await fal.subscribe("fal-ai/face-to-sticker", {
        input: faceToStickerInput,
        logs: true,
      });

      const images = result.data?.images
        ?.map((img: any) => img.url || "")
        .filter(Boolean);

      await deductCredits(advancedOptions.numImages, "fal-ai/face-to-sticker");

      if (images && images.length > 0) {
        const newImages: ImageGeneration[] = images.map((image: string) => ({
          id: uuidv4(),
          prompt,
          image,
          timestamp: new Date(),
          style: advancedOptions.style,
          seed: advancedOptions.seed || generateRandomSeed(),
          aspectRatio: advancedOptions.aspectRatio,
          complexity: prompt.split(" ").length,
        }));

        setGeneratedImages((prev) => [...newImages, ...prev].slice(0, 20));
        setCurrentImage(newImages[0]);
        addGeneratedImages(newImages.map((img) => img.image));

        // Upload to S3
        await uploadImagesToS3(newImages);
      } else {
        toast.error("No sticker images were generated");
      }
    } catch (err: any) {
      toast.error(err.message || "Sticker generation failed");
    } finally {
      setLoading(false);
    }
  }, [prompt, imageUrl, advancedOptions]);

  const uploadImagesToS3 = async (images: ImageGeneration[]) => {
    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setIsUploading(true);
      setProgress(0);

      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const base64Images = await Promise.all(
        images.map(async (img) => {
          // If already base64, return as is
          if (img.image.startsWith("data:image")) return img.image;

          try {
            // Fetch image and convert to WebP
            const response = await fetch(img.image);
            const blob = await response.blob();

            // Convert to WebP
            const bitmap = await createImageBitmap(blob);
            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(bitmap, 0, 0);

            // Convert to WebP data URL
            const webpDataUrl = canvas.toDataURL("image/webp");
            return webpDataUrl;
          } catch (error) {
            console.error("Image conversion error:", error);
            return img.image; // Fallback to original if conversion fails
          }
        })
      );

      await axios.post("/api/image/upload-image", {
        images: base64Images,
        userId,
        prompt,
        model: "fal-ai/face-to-sticker",
        creditsUsed: images.length * 2,
      });

      const historyItem: HistoryItem = {
        id: Date.now(),
        imageUrls: base64Images,
        prompt,
        timestamp: new Date().toLocaleString(),
        model: "fal-ai/face-to-sticker",
        size: "square_hd",
        quality: "standard",
        style: advancedOptions.style,
      };

      addToHistory(historyItem);

      if (userId) {
        await fetchHistory(userId);
      }

      toast.success("Sticker images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload sticker images");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-hidden">
      <div className="min-h-screen bg-white">
        <div className="text-black font-extrabold text-2xl my-2">
          Face to Sticker
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Image Upload Section */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-black backdrop-blur-md p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Upload Image
            </h2>
            <div className="relative w-full border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 16.5v-1.95c0-.528.2-1.038.552-1.414l5.586-5.586A2 2 0 0110.05 7h3.9a2 2 0 011.414.586l5.586 5.586c.352.376.552.886.552 1.414v1.95m-5.25-2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12 16v6"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-600">
                  Drag and drop an image, or click to select
                </span>
              </div>
            </div>

            {imageUrl && (
              <div className="mt-4">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>

          {/* Prompt and Generation Area */}
          <main className="col-span-12 lg:col-span-8 space-y-6 rounded-xl">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              generateImage={generateSticker}
              loading={loading}
              //   buttonText="Generate Sticker"
            />

            <ImagePreview currentImage={currentImage} />

            {/* Loading & Error Handling */}
            {loading && (
              <div className="w-full bg-gray-800 p-4 rounded-xl mt-4 text-center">
                <p className="text-blue-300">
                  Generating sticker using Face to Sticker AI...
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl">
                {error}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
