"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useCallback } from "react";
import { createFalClient } from "@fal-ai/client";
import { ImageGeneration, AIModelConfig, AdvancedOptions } from "@/types";
import { generateRandomSeed } from "@/utils/utils";
import { PromptInput } from "@/components/fal/dashboard/PromptInput";
import { ImagePreview } from "@/components/fal/dashboard/ImagePreview";
import ImageHistory from "@/components/fal/dashboard/ImageHistory";
import { AdvancedSettings } from "@/components/fal/dashboard/Settings";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generatedImages, setGeneratedImages] = useState<ImageGeneration[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageGeneration | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiModels] = useState<AIModelConfig[]>(DEFAULT_AI_MODELS);

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    style: "photorealistic",
    aspectRatio: "1:1",
    negativePrompt: "",
    samplingSteps: 50,
    cfgScale: 7,
    seed: null,
    enhancementLevel: "standard",
    numImages: 1,
  });

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please provide a detailed prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt,
          image_size: "square_hd",
          num_inference_steps: advancedOptions.samplingSteps,
          guidance_scale: advancedOptions.cfgScale,
          seed: advancedOptions.seed || generateRandomSeed(),
          num_images: advancedOptions.numImages,
        },
        logs: true,
      });

      const images = result.data?.images
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ?.map((img: any) => img.url || "")
        .filter(Boolean);

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
      } else {
        setError("No images were generated");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Image generation failed");
    } finally {
      setLoading(false);
    }
  }, [prompt, advancedOptions]);

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-hidden">
      <div className="min-h-screen bg-white">
        <div className="text-black font-extrabold text-2xl my-2">Flux Dev</div>

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
