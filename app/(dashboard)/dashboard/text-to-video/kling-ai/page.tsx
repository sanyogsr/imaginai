"use client";

import { useState, useCallback, useEffect } from "react";
import { createFalClient } from "@fal-ai/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useSession } from "next-auth/react";
import { userCreditsStore } from "@/store/useCreditStore";

import { PromptInput } from "@/components/fal/video/kling/PromptInput";
import { VideoPreview } from "@/components/fal/video/kling/VideoPreview";
import { AdvancedSettings } from "@/components/fal/video/kling/AdvanceSettings";
import { useVideoHistoryStore } from "@/store/fal/useVideoHistory";
import { useRouter } from "next/navigation";
import VideoHistorySidebar from "@/components/fal/video/kling/VideoHistory";

// Types
interface VideoGeneration {
  id: string;
  prompt: string;
  videoUrl: string;
  timestamp: Date;
  duration: string;
  aspectRatio: string;
}

interface AdvancedOptions {
  duration: "5" | "10";
  aspectRatio: "16:9" | "9:16" | "1:1";
}

const fal = createFalClient({
  proxyUrl: "/api/fal/proxy",
});

export default function KlingVideoDashboard() {
  const { data: session } = useSession();
  const { videos, fetchVideoHistory, addVideoToHistory } =
    useVideoHistoryStore();
  const [isAdvancedSettingsVisible, setIsAdvancedSettingsVisible] =
    useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedVideos, setGeneratedVideos] = useState<VideoGeneration[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoGeneration | null>(
    null
  );
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const { fetchCredits, credits, deductCredits } = userCreditsStore();

  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    duration: "5",
    aspectRatio: "16:9",
  });

  // Track processed request IDs to prevent duplicate uploads
  const [processedRequestIds, setProcessedRequestIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchVideoHistory(session.user.id);
    }
  }, [session, fetchVideoHistory]);

  const generateVideo = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Please provide a detailed prompt");
      return;
    }
    if (credits === null || credits < 25) {
      toast.error("Please upgrade your plan to get more credits.");
      router.push("/dashboard/upgrade");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Please log in to generate videos");
      return;
    }

    setLoading(true);

    try {
      let numOfImages = 0;
      if (advancedOptions.duration === "10" && credits < 50) {
        toast.error("Please purchase credits to generate the video");
        router.push("/dashboard/upgrade");
        setLoading(false);
        return;
      }
      const { request_id } = await fal.queue.submit(
        "fal-ai/kling-video/v1.5/pro/text-to-video",
        {
          input: {
            prompt,
            duration: advancedOptions.duration,
            aspect_ratio: advancedOptions.aspectRatio,
          },
          webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/kling/webhook`,
        }
      );

      if (advancedOptions.duration === "5") {
        numOfImages = 1;
      } else if (advancedOptions.duration === "10") {
        numOfImages = 2;
      }
      setRequestId(request_id);
      await deductCredits(
        numOfImages,
        "fal-ai/kling-video/v1.5/pro/text-to-video"
      );

      toast.info("Video generation started. Checking status...");
    } catch (err: any) {
      toast.error(err.message || "Video generation failed");
      setLoading(false);
    }
  }, [prompt, advancedOptions, session, credits, router]);

  // Poll for request status
  useEffect(() => {
    if (!requestId) return;

    // Prevent processing the same request multiple times
    if (processedRequestIds.has(requestId)) {
      return;
    }

    const checkStatus = async () => {
      try {
        const status = await fal.queue.status(
          "fal-ai/kling-video/v1.5/pro/text-to-video",
          { requestId }
        );

        if (status.status === "COMPLETED") {
          clearInterval(intervalId); // Stop polling when done

          // Prevent duplicate processing
          if (processedRequestIds.has(requestId)) {
            return;
          }

          const result = await fal.queue.result(
            "fal-ai/kling-video/v1.5/pro/text-to-video",
            { requestId }
          );

          const videoUrl = result.data.video.url;

          // Avoid duplicate uploads
          if (generatedVideos.find((vid) => vid.videoUrl === videoUrl)) {
            setProcessedRequestIds((prev) => new Set(prev).add(requestId));
            setLoading(false);
            return;
          }

          const uploadResponse = await axios.post("/api/kling/video-upload", {
            videoUrl,
            userId: session?.user?.id,
            prompt,
            model: "fal-ai/kling-video/v1.5/pro",
            duration: advancedOptions.duration,
            aspectRatio: advancedOptions.aspectRatio,
          });

          const newVideo: VideoGeneration = {
            id: uuidv4(),
            prompt,
            videoUrl: uploadResponse.data.url,
            timestamp: new Date(),
            duration: advancedOptions.duration,
            aspectRatio: advancedOptions.aspectRatio,
          };

          setGeneratedVideos((prev) => {
            // Ensure no duplicates
            if (prev.some((vid) => vid.videoUrl === newVideo.videoUrl)) {
              return prev;
            }
            return [newVideo, ...prev];
          });

          setCurrentVideo(newVideo);

          addVideoToHistory({
            id: newVideo.id,
            userId: session?.user?.id!,
            prompt,
            videoUrl: uploadResponse.data.url,
            timestamp: new Date().toISOString(),
            model: "fal-ai/kling-video/v1.5/pro",
            duration: advancedOptions.duration,
            aspectRatio: advancedOptions.aspectRatio,
          });

          // Mark this request as processed
          setProcessedRequestIds((prev) => new Set(prev).add(requestId));

          toast.success("Video generated successfully!");
          setLoading(false);
        } else if ((status.status as string) === "FAILED") {
          toast.error("Video generation failed");
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        toast.error("Error checking video status");
        setLoading(false);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(checkStatus, 5000);
    return () => clearInterval(intervalId);
  }, [
    requestId,
    prompt,
    advancedOptions,
    session,
    addVideoToHistory,
    generatedVideos,
    processedRequestIds,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Kling Ai Video Generation
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Advanced Settings Sidebar - Visible on Large Screens */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Advanced Options
              </h2>
              <AdvancedSettings
                advancedOptions={advancedOptions}
                updateAdvancedOptions={(options: any) =>
                  setAdvancedOptions((prev) => ({ ...prev, ...options }))
                }
              />
            </div>
          </aside>

          {/* Main Generation Area - Center */}
          <main className="lg:col-span-6 space-y-6">
            {/* Prompt Input with Enhanced Container */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-1">
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                generateVideo={generateVideo}
                loading={loading}
              />
            </div>

            {/* Advanced Settings Toggle for Small/Medium Screens */}
            <div className="block lg:hidden">
              <button
                onClick={() =>
                  setIsAdvancedSettingsVisible(!isAdvancedSettingsVisible)
                }
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl shadow-md text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              >
                {isAdvancedSettingsVisible
                  ? "Hide Advanced Settings"
                  : "Show Advanced Settings"}
              </button>

              {/* Advanced Settings (Hidden by Default) */}
              {isAdvancedSettingsVisible && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
                  <AdvancedSettings
                    advancedOptions={advancedOptions}
                    updateAdvancedOptions={(options: any) =>
                      setAdvancedOptions((prev) => ({ ...prev, ...options }))
                    }
                  />
                </div>
              )}
            </div>

            {/* Video Preview */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-md p-4">
              <VideoPreview currentVideo={currentVideo} />
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-700 font-medium mb-2">
                  Generating video using Kling AI...
                </p>
                <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                  <div className="animate-pulse bg-blue-500 h-full" />
                </div>
              </div>
            )}
          </main>

          {/* Video History Sidebar - Right Side */}
          <aside className="lg:col-span-3">
            <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Video History
              </h2>
              <VideoHistorySidebar
                videos={videos}
                setCurrentVideo={setCurrentVideo}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
