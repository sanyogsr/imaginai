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
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);
  // Fetch video history on component mount
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
        alert("please purchase credits to generate the video");
        router.push("/dashboard/upgrade");
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
  }, [prompt, advancedOptions, session]);

  // Poll for request status
  useEffect(() => {
    if (!requestId) return;

    const checkStatus = async () => {
      try {
        const status = await fal.queue.status(
          "fal-ai/kling-video/v1.5/pro/text-to-video",
          { requestId }
        );

        if (status.status === "COMPLETED") {
          clearInterval(intervalId); // Stop polling when done
          const result = await fal.queue.result(
            "fal-ai/kling-video/v1.5/pro/text-to-video",
            { requestId }
          );

          const videoUrl = result.data.video.url;

          // Avoid duplicate uploads
          if (generatedVideos.find((vid) => vid.videoUrl === videoUrl)) return;

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

          setGeneratedVideos((prev) => [newVideo, ...prev]);
          setCurrentVideo(newVideo);

          addVideoToHistory({
            id: newVideo.id,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            userId: session?.user?.id!,
            prompt,
            videoUrl: uploadResponse.data.url,
            timestamp: new Date().toISOString(),
            model: "fal-ai/kling-video/v1.5/pro",
            duration: advancedOptions.duration,
            aspectRatio: advancedOptions.aspectRatio,
          });

          toast.success("Video generated successfully!");
        }
      } catch (err) {
        toast.error("Error checking video status");
      } finally {
        setLoading(false);
        setRequestId(null); // Reset request ID
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
  ]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="min-h-screen bg-white">
        <h1 className="text-2xl font-bold mb-4">Kling Video Generation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Advanced Settings */}
          <aside className="lg:col-span-3 bg-gray-100 p-4 rounded-xl">
            <AdvancedSettings
              advancedOptions={advancedOptions}
              updateAdvancedOptions={(options: any) =>
                setAdvancedOptions((prev) => ({ ...prev, ...options }))
              }
            />
          </aside>

          {/* Main Generation Area */}
          <main className="lg:col-span-6 space-y-4">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              generateVideo={generateVideo}
              loading={loading}
            />

            <VideoPreview currentVideo={currentVideo} />

            {/* Loading Indicator */}
            {loading && (
              <div className="w-full bg-blue-100 p-4 rounded-xl text-center">
                <p>Generating video using Kling AI...</p>
                <div className="w-full bg-blue-200 h-2 mt-2 overflow-hidden">
                  <div className="animate-pulse bg-blue-500 h-full" />
                </div>
              </div>
            )}
          </main>

          {/* Video History */}
          <aside className="lg:col-span-3 bg-gray-100 p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Video History</h2>
            {videos.map((video: any) => (
              <div
                key={video.id}
                onClick={() =>
                  setCurrentVideo({
                    id: video.id,
                    prompt: video.prompt,
                    videoUrl: video.videoUrl,
                    timestamp: new Date(video.timestamp),
                    duration: video.duration,
                    aspectRatio: video.aspectRatio,
                  })
                }
                className="cursor-pointer mb-2 hover:bg-gray-200 p-2 rounded"
              >
                <p className="text-sm truncate">{video.prompt}</p>
                <p className="text-xs text-gray-500">
                  {new Date(video.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
