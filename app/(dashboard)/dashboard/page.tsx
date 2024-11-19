"use client";

// import { useState, useCallback, useEffect } from "react";
// import { Loader } from "lucide-react";
// import { SettingsPanel } from "@/components/SettingPanel";
// import EnhancedImagePreview from "@/components/ImagePreview";
// import EnhancedPromptInput from "@/components/PromptInput";
// import { userCreditsStore } from "@/store/useCreditStore";
// import { toast } from "sonner";
// import { redirect, useRouter } from "next/navigation";
// import axios from "axios";
// import { useImageStore } from "@/store/useImageStore";
// import { useSettingsStore } from "@/store/useSettingsStore";
// import { useSession } from "next-auth/react";
// import { useHistoryStore } from "@/store/useHistoryStore";
// import HistoryPanel from "@/components/History";
// import ExamplePromptsPanel from "@/components/ExamplePromptPanel";
// import DashboardNavbar from "@/components/DashboardNavbar";

import { useState, useCallback, useEffect } from "react";
import { Loader } from "lucide-react";
import { SettingsPanel } from "@/components/SettingPanel";
import EnhancedImagePreview from "@/components/ImagePreview";
import EnhancedPromptInput from "@/components/PromptInput";
import { userCreditsStore } from "@/store/useCreditStore";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { useImageStore } from "@/store/useImageStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSession } from "next-auth/react";
import { useHistoryStore } from "@/store/useHistoryStore";
import HistoryPanel from "@/components/History";
import ExamplePromptsPanel from "@/components/ExamplePromptPanel";

// interface GenerationPhase {
//   phase: number;
//   message: string;
// }
// interface GenerationSettings {
//   model: string;
//   size: string;
//   quality: string;
//   style: string;
//   numberOfImages: number;
// }

// interface ImageGeneration {
//   prompt: string;
//   settings: GenerationSettings;
//   status: "idle" | "generating" | "complete" | "error";
//   progress: number;
// }
interface HistoryItem {
  id: number;
  imageUrls: string[];
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

const Dashboard = () => {
  // const [activeTab, setActiveTab] = useState("image");
  const [isGenerating, setIsGenerating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prompt, setPrompt] = useState("");
  // const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  // const [currentPhase, setCurrentPhase] = useState<GenerationPhase>({
  // phase: 0,
  // message: "Ready to create",
  // });
  const { addToHistory, fetchHistory } = useHistoryStore();

  const { model, size, quality, style, numberOfImages } = useSettingsStore();
  const [isUploading, setIsUploading] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const router = useRouter();
  const { addGeneratedImages, clearGeneratedImages } = useImageStore();
  const { fetchCredits, credits, deductCredits } = userCreditsStore();
  const { data: session, status } = useSession();
  // const userId = session?.user?.id;

  useEffect(() => {
    fetchCredits();
    console.log(session);
    if (session?.user?.id) {
      fetchHistory(session.user.id);
    }
  }, [fetchCredits, fetchHistory, session, status]);

  const handlePromptSubmit = async (prompt: string) => {
    simulateProgress();

    const cleanedPrompt = prompt
      .trim()
      .normalize("NFC")
      .replace(/[^\w\s.,!?'":;\-()]/gi, "")
      .slice(0, 150);

    if (!cleanedPrompt) return;

    if (credits === null || credits <= 0) {
      toast.error("Please upgrade your plan to get more credits.");
      router.push("/dashboard/upgrade");
      return;
    }

    setIsGenerating(true);
    setGenerationComplete(false);

    clearGeneratedImages();
    // const stopProgress = simulateProgress();
    const generationInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(generationInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    try {
      const [width, height] = size.split("x").map(Number);

      console.log("Sending prompt to generate-image:", cleanedPrompt);
      const response = await axios.post("/api/generate-image", {
        prompt: cleanedPrompt,
        model,
        width,
        height,
        quality,
        style,
        steps: 4,
        n: numberOfImages,
      });

      if (response.status !== 200 || !response.data) {
        throw new Error("Image generation failed");
      }

      clearInterval(generationInterval);
      setProgress(100);
      setGenerationComplete(true);

      // Add a slight delay before starting upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data1 = response.data;
      await deductCredits(numberOfImages);

      let generatedImages: string[] = [];
      if (data1.response && data1.response.data) {
        generatedImages = data1.response.data.map(
          (imageData: { b64_json: string }) =>
            `data:image/png;base64,${imageData.b64_json}`
        );
        addGeneratedImages(generatedImages);
      } else {
        console.warn("No images received from generate-image API");
      }

      const userId = session?.user?.id;
      if (userId && generatedImages.length > 0) {
        console.log("Uploading images to S3...");
        setIsUploading(true);
        setProgress(0);

        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(uploadInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);
        await axios.post("/api/image/upload-image", {
          images: generatedImages,
          userId,
          prompt: cleanedPrompt,
          model,
          creditsUsed: numberOfImages * 2,
        });

        setUploadProgress(100);
        clearInterval(uploadInterval);
        const historyItem: HistoryItem = {
          id: Date.now(),
          imageUrls: generatedImages,
          prompt: cleanedPrompt,
          timestamp: new Date().toLocaleString(),
          model,
          size,
          quality,
          style,
        };
        addToHistory(historyItem);
      } else {
        toast.warning("Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Error during generation or upload:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setIsUploading(false);
        setGenerationComplete(false);
        setProgress(0);
        setUploadProgress(0);
      }, 1000);
    }
  };
  const simulateProgress = useCallback(() => {
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect("/");
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="w-full">
              <EnhancedImagePreview
                isGenerating={isGenerating}
                isUploading={isUploading}
                progress={isUploading ? uploadProgress : progress}
                generationComplete={generationComplete}
              />
            </div>

            <div className="w-full">
              <EnhancedPromptInput
                onSubmit={handlePromptSubmit}
                isGenerating={isGenerating}
              />
            </div>

            <div className="block lg:hidden w-full">
              <SettingsPanel />
            </div>

            <div className="w-full">
              <ExamplePromptsPanel
                onPromptSelect={(prompt) => {
                  setPrompt(prompt);
                  document
                    .querySelector("#prompt-input")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-2/5 space-y-6">
            <div className="hidden lg:block w-full">
              <SettingsPanel />
            </div>
            <div className="w-full">
              <HistoryPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
