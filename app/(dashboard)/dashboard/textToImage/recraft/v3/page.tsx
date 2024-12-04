"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useCallback, useEffect } from "react";
import { createFalClient } from "@fal-ai/client";
import {
  ImageGeneration,
  AIModelConfig,
  AdvancedOptions,
  HistoryItem,
} from "@/types";
import { generateRandomSeed } from "@/utils/utils";
import { PromptInput } from "@/components/fal/dashboard/PromptInput";
import { ImagePreview } from "@/components/fal/dashboard/ImagePreview";
import ImageHistory from "@/components/fal/dashboard/ImageHistory";
import { AdvancedSettings } from "@/components/fal/dashboard/RecraftSetting";
import { userCreditsStore } from "@/store/useCreditStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useImageStore } from "@/store/useImageStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import axios from "axios";
import { ImageSize } from "@fal-ai/client/endpoints";

const fal = createFalClient({
  proxyUrl: "/api/fal/proxy",
});

const DEFAULT_AI_MODELS: AIModelConfig[] = [
  {
    id: "flux-v1",
    name: "Flux Advanced",
    maxResolution: 2048,
    supportedStyles: ["photorealistic", "artistic", "anime"],
    speed: 0.8,
  },
  {
    id: "flux-v2",
    name: "Flux Pro",
    maxResolution: 4096,
    supportedStyles: ["photorealistic", "artistic", "hyperrealistic"],
    speed: 0.6,
  },
];

export default function ResponsiveAIImageGenerationDashboard() {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<ImageGeneration[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageGeneration | null>(
    null
  );
  const { fetchCredits, credits, deductCredits } = userCreditsStore();
  const { addGeneratedImages, clearGeneratedImages } = useImageStore();
  // const { addToHistory, fetchHistory } = useHistoryStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [aiModels] = useState<AIModelConfig[]>(DEFAULT_AI_MODELS);
  const { data: session } = useSession();

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    style: "realistic_image",
    aspectRatio: "square_hd",
    negativePrompt: "",
    samplingSteps: 50,
    cfgScale: 7,
    seed: null,
    enhancementLevel: "standard",
    numImages: 1,
  });

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please provide a detailed prompt");
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
      const result = await fal.subscribe("fal-ai/recraft-v3", {
        input: {
          prompt,
          image_size: advancedOptions.aspectRatio as ImageSize,
          style: advancedOptions.style as any,
        },
        logs: true,
      });

      const images = result.data?.images
        ?.map((img: any) => img.url || "")
        .filter(Boolean);

      await deductCredits(advancedOptions.numImages, "fal-ai/recraft-v3");

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
        toast.error("No images were generated");
      }
    } catch (err: any) {
      toast.error(err.message || "Image generation failed");
    } finally {
      setLoading(false);
    }
  }, [prompt, advancedOptions]);

  // const uploadImagesToS3 = async (images: ImageGeneration[]) => {
  //   const userId = session?.user?.id;
  //   if (!userId) return;

  //   try {
  //     setIsUploading(true);
  //     setProgress(0);

  //     const uploadInterval = setInterval(() => {
  //       setProgress((prev) => {
  //         if (prev >= 90) {
  //           clearInterval(uploadInterval);
  //           return 90;
  //         }
  //         return prev + 10;
  //       });
  //     }, 500);

  //     const base64Images = await Promise.all(
  //       images.map(async (img) => {
  //         // If already base64, return as is
  //         if (img.image.startsWith("data:image")) return img.image;

  //         try {
  //           // Fetch image and convert to WebP
  //           const response = await fetch(img.image);
  //           const blob = await response.blob();

  //           // Convert to WebP
  //           const bitmap = await createImageBitmap(blob);
  //           const canvas = document.createElement("canvas");
  //           canvas.width = bitmap.width;
  //           canvas.height = bitmap.height;
  //           const ctx = canvas.getContext("2d");
  //           ctx?.drawImage(bitmap, 0, 0);

  //           // Convert to WebP data URL
  //           const webpDataUrl = canvas.toDataURL("image/webp");
  //           return webpDataUrl;
  //         } catch (error) {
  //           console.error("Image conversion error:", error);
  //           return img.image; // Fallback to original if conversion fails
  //         }
  //       })
  //     );

  //     await axios.post("/api/image/upload-image", {
  //       images: base64Images,
  //       userId,
  //       prompt,
  //       model: "fal-ai/flux/dev",
  //       creditsUsed: images.length * 2,
  //     });

  //     const historyItem: HistoryItem = {
  //       id: Date.now(),
  //       imageUrls: base64Images,
  //       prompt,
  //       timestamp: new Date().toLocaleString(),
  //       model: "fal-ai/flux/dev",
  //       size: "square_hd",
  //       quality: "standard",
  //       style: advancedOptions.style,
  //     };

  //     addToHistory(historyItem);

  //     if (userId) {
  //       await fetchHistory(userId);
  //     }

  //     toast.success("Images uploaded successfully");
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     toast.error("Failed to upload images");
  //   } finally {
  //     setIsUploading(false);
  //     setProgress(0);
  //   }
  // };
  const uploadImagesToS3 = async (images: ImageGeneration[]) => {
    const userId = session?.user?.id;
    if (!userId) return;

    try {
      setIsUploading(true);
      setProgress(0);

      const uploadImages = await Promise.all(
        images.map(async (img) => {
          // Ensure image is a base64 data URL
          if (!img.image.startsWith("data:image")) {
            try {
              const response = await fetch(img.image);
              const blob = await response.blob();
              const bitmap = await createImageBitmap(blob);
              const canvas = document.createElement("canvas");
              canvas.width = bitmap.width;
              canvas.height = bitmap.height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(bitmap, 0, 0);
              return canvas.toDataURL("image/webp");
            } catch (error) {
              console.error("Image conversion error:", error);
              return null;
            }
          }
          return img.image;
        })
      );

      // Filter out any null values
      const validImages = uploadImages.filter(Boolean);

      if (validImages.length === 0) {
        toast.error("No valid images to upload");
        return;
      }

      await axios.post("/api/image/upload-image", {
        images: validImages,
        userId,
        prompt,
        model: "fal-ai/flux/dev",
        creditsUsed: images.length * 2,
      });

      // Rest of the code remains the same...
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-hidden">
      <div className="min-h-screen bg-white">
        <div className="text-black font-extrabold text-2xl my-2">
          Recraft V3
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Large Screen Layout */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-black backdrop-blur-md p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Advanced Settings
            </h2>
            <AdvancedSettings
              advancedOptions={advancedOptions}
              aiModels={aiModels}
              updateAdvancedOptions={(options) =>
                setAdvancedOptions((prev) => ({ ...prev, ...options }))
              }
            />
          </aside>

          {/* Central Generation Area */}
          <main className="col-span-12 lg:col-span-6 space-y-6 rounded-xl">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              generateImage={generateImage}
              loading={loading}
            />

            <ImagePreview currentImage={currentImage} />

            {/* Mobile & Tablet: Advanced Settings */}
            <div className="block lg:hidden bg-white border border-black backdrop-blur-md p-6 rounded-xl space-y-4 mt-4">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Advanced Settings
              </h2>
              <AdvancedSettings
                advancedOptions={advancedOptions}
                aiModels={aiModels}
                updateAdvancedOptions={(options) =>
                  setAdvancedOptions((prev) => ({ ...prev, ...options }))
                }
              />
            </div>

            {/* Mobile & Tablet: Image History */}
            <div className="block lg:hidden bg-white border border-black backdrop-blur-md p-6 rounded-xl mt-4">
              <h3 className="text-xl font-semibold mb-4 text-black">
                Image History
              </h3>
              <ImageHistory />
            </div>

            {/* Loading & Error Handling */}
            {loading && (
              <div className="w-full bg-gray-800 p-4 rounded-xl mt-4 text-center">
                <p className="text-blue-300">
                  Generating images using FLUX AI...
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

          {/* Large Screen Image History */}
          <aside className="hidden lg:block lg:col-span-3 border  backdrop-blur-md px-3 py-2 rounded-xl">
            <div className="flex justify-center">
              <ImageHistory />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
