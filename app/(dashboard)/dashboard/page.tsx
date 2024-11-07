"use client";
import React, { useCallback, useState } from "react";
import { HistoryPanel } from "@/components/History";
import { ImagePreview } from "@/components/ImagePreview";
import { PromptInput } from "@/components/PromptInput";
import { SettingsPanel } from "@/components/SettingPanel";
import { Progress } from "@/components/ProgressBar";
import { useHistoryStore } from "@/store/useHistoryStore";
import { cn } from "@/utils/cn";
import { AnimatedContainer } from "@/components/AnimatedContainer";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useImageStore } from "@/store/useImageStore";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { userCreditsStore } from "@/store/useCreditStore";

interface Settings {
  model: string;
  size: string;
  quality: string;
  style: string;
}

interface HistoryItem {
  id: number;
  imageUrls: string[]; // Changed to array to store multiple images
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

interface GenerationPhase {
  phase: number;
  message: string;
}

export default function Dashboard() {
  const { addToHistory } = useHistoryStore();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [settings, setSettings] = useState<Settings>({
    model: "black-forest-labs/FLUX.1-schnell",
    size: "1600x1024",
    quality: "standard",
    style: "natural",
  });
  const { numberOfImages } = useSettingsStore();
  const { addGeneratedImages, clearGeneratedImages } = useImageStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [generatedImage, setGeneratedImage] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const { credits, deductCredits } = userCreditsStore();

  const [currentPhase, setCurrentPhase] = useState<GenerationPhase>({
    phase: 0,
    message: "Ready",
  });

  const simulateProgress = useCallback(() => {
    const phases = [
      { message: "Analyzing prompt..." },
      { message: "Generating initial concepts..." },
      { message: "Refining details..." },
      { message: "Finalizing image..." },
    ];

    setProgress(0);
    let currentPhase = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 2, 100);
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);

        if (phaseIndex !== currentPhase && phaseIndex < phases.length) {
          currentPhase = phaseIndex;
          setCurrentPhase({
            phase: phaseIndex,
            message: phases[phaseIndex].message,
          });
        }

        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handlePromptSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    if (credits === null || credits <= 0) {
      router.push("/dashboard/upgrade"); // Redirect to upgrade page if credits are zero
      return;
    }

    setIsGenerating(true);
    clearGeneratedImages();
    const stopProgress = simulateProgress();

    try {
      // Make a POST request to the API route using axios
      const response = await axios.post("/api/generate-image", {
        prompt,
        model: settings.model,
        width: parseInt(settings.size.split("x")[0], 10),
        height: parseInt(settings.size.split("x")[1], 10),
      });

      if (response.status !== 200) throw new Error("Image generation failed");

      const data = response.data;
      await deductCredits(2);
      if (data.response && data.response.data) {
        const generatedImages = data.response.data.map(
          (imageData: { b64_json: string }) =>
            `data:image/png;base64,${imageData.b64_json}`
        );

        addGeneratedImages(generatedImages);

        // Store all generated images in history
        const historyItem: HistoryItem = {
          id: Date.now(),
          imageUrls: generatedImages,
          prompt,
          timestamp: new Date().toLocaleString(),
          ...settings,
        };

        addToHistory(historyItem); // Save the history with the correct image URLs
      }
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      stopProgress();
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentPhase({ phase: 0, message: "Ready" });
      }, 500);
    }
  };
  if (status === "loading")
    return (
      <p className="text-black mt-20 flex items-center justify-center h-screen">
        Loading...
      </p>
    ); // Wait for session to load
  if (!session) {
    redirect("/");
    return null;
  }
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white overflow-hidden">
      <div className="container mx-auto h-[calc(100vh-4rem)] mt-[3.5rem]">
        <div className="grid grid-cols-12 gap-6 p-6 h-full">
          {/* History Panel */}
          <div className="hidden lg:block lg:col-span-2 h-full">
            <div className="sticky top-6">
              <AnimatedContainer
                variant="glass"
                className="h-[calc(100vh-6rem)]"
              >
                <HistoryPanel onImageSelect={setSelectedImage} />
              </AnimatedContainer>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 h-full">
            <div className="p-8 h-full flex flex-col gap-6">
              {/* Generation Progress */}
              <div
                className={cn(
                  "space-y-4 transition-all duration-500",
                  isGenerating ? "opacity-100" : "opacity-0 h-0"
                )}
              >
                <Progress
                  value={progress}
                  variant="gradient"
                  size="md"
                  showValue
                />
                <div className="flex justify-between text-sm">
                  <span className="text-teal-500 font-medium">
                    {currentPhase.message}
                  </span>
                  <span className="text-blue-500 font-medium">
                    {progress}% Complete
                  </span>
                </div>
              </div>

              {/* Image Preview */}
              <div
                className={cn(
                  "flex-1 rounded-xl overflow-hidden bg-gray-50",
                  "transition-all duration-500 transform",
                  isGenerating ? "scale-95 blur-sm" : "scale-100"
                )}
              >
                <ImagePreview />
              </div>

              {/* Prompt Input */}
              <PromptInput
                onSubmit={handlePromptSubmit}
                isLoading={isGenerating}
              />
            </div>
            {/* </AnimatedContainer> */}
          </div>

          {/* Settings Panel */}
          <div className="col-span-12 lg:col-span-2 h-full">
            <div className="sticky top-6">
              <AnimatedContainer
                variant="glass"
                className="h-[calc(100vh-6rem)]"
              >
                <SettingsPanel creditsLeft={100} daysUntilRenewal={30} />
              </AnimatedContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
