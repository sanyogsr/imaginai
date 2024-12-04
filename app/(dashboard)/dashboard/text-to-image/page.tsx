"use client";
import { useState, useCallback, useEffect } from "react";
import { Loader } from "lucide-react";
import { SettingsPanel } from "@/components/SettingPanel";
import EnhancedImagePreview from "@/components/ImagePreview";
import EnhancedPromptInput from "@/components/PromptInput";
import { userCreditsStore } from "@/store/useCreditStore";
import { toast } from "sonner";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useImageStore } from "@/store/useImageStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSession } from "next-auth/react";
import { useHistoryStore } from "@/store/useHistoryStore";
import HistoryPanel from "@/components/History";
import ExamplePromptsPanel from "@/components/ExamplePromptPanel";
import Footer from "@/components/DashboardFooter";
import { Suspense } from "react";

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

const DashboardContent = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prompt, setPrompt] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { addToHistory, fetchHistory } = useHistoryStore();
  const searchParams = useSearchParams();

  const { updateSetting } = useSettingsStore();

  const { model, size, quality, style, numberOfImages } = useSettingsStore();
  const [isUploading, setIsUploading] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false); // New state

  const router = useRouter();
  const { addGeneratedImages, clearGeneratedImages } = useImageStore();
  const { fetchCredits, credits, deductCredits } = userCreditsStore();
  const { data: session, status } = useSession();
  useEffect(() => {
    // Get the model from the query parameters
    const defaultModel = searchParams.get("model");
    if (defaultModel) {
      updateSetting("model", defaultModel); // Update the model in the SettingsStore
    }
  }, [searchParams, updateSetting]);
  useEffect(() => {
    fetchCredits();
    console.log(session);
    if (session?.user?.id) {
      fetchHistory(session.user.id);
      setIsUploadComplete(false);
    }
  }, [fetchCredits, fetchHistory, session, isUploadComplete]);

  // prompt handling function
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

    // Simulating the progress bar
    const generationInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(generationInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

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

      // Add a slight delay before starting upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data1 = response.data;

      await deductCredits(numberOfImages, model);
      clearInterval(generationInterval);
      setProgress(100);
      setGenerationComplete(true);

      let generatedImages: string[] = [];
      if (data1.response && data1.response.data) {
        // Map each image data correctly
        generatedImages = data1.response.data.map(
          (imageData: { b64_json: string }) =>
            `data:image/png;base64,${imageData.b64_json}`
        );
        // Add all generated images to the store
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

        // Correctly create a history item with all images
        const historyItem: HistoryItem = {
          id: Date.now(),
          imageUrls: generatedImages, // Make sure to spread all generated images
          prompt: cleanedPrompt,
          timestamp: new Date().toLocaleString(),
          model,
          size,
          quality,
          style,
        };
        addToHistory(historyItem);
        setIsUploadComplete(true);
        if (userId) {
          await fetchHistory(userId);
        }
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

      <Footer />
    </div>
  );
};

// export default Dashboard;

const Dashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
