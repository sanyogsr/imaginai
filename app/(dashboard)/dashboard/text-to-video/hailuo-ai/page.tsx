"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useCallback } from "react";
import { createFalClient } from "@fal-ai/client";
import {
  VideoGeneration,
  VideoModelConfig,
  VideoAdvancedOptions,
  FalVideoResult,
  VideoPreviewProps,
  VideoAdvancedSettingsProps,
} from "@/types";
import { PromptInput } from "@/components/fal/dashboard/PromptInput";
import { VideoPreview } from "@/components/fal/video/VideoPreview";
import VideoHistory from "@/components/fal/video/VideoHistory";
import VideoAdvancedSettings from "@/components/fal/video/VideoSettings";

const fal = createFalClient({
  proxyUrl: "/api/fal/proxy",
});

const DEFAULT_VIDEO_MODELS: VideoModelConfig[] = [
  {
    id: "minimax-video/image-to-video",
    name: "Minimax Video Hailuo",
    maxDuration: 4,
    supportedStyles: ["realistic", "anime", "artistic"],
    speed: 0.7,
  },
];

export default function ResponsiveVideoGenerationDashboard() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generatedVideos, setGeneratedVideos] = useState<VideoGeneration[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoGeneration | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoModels] = useState<VideoModelConfig[]>(DEFAULT_VIDEO_MODELS);

  const [advancedOptions, setAdvancedOptions] = useState<VideoAdvancedOptions>({
    style: "realistic",
    prompt_optimizer: true,
    seed: null,
  });

  const generateVideo = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please provide a detailed prompt and an initial image");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { request_id } = await fal.queue.submit("fal-ai/minimax-video", {
        input: {
          prompt,
          prompt_optimizer: advancedOptions.prompt_optimizer,
        },
        webhookUrl: "/api/video-generation-webhook", // Optional: for async tracking
      });

      // Poll for the result
      const checkStatus = async () => {
        const status = await fal.queue.status(
          "fal-ai/minimax-video/image-to-video",
          {
            requestId: request_id,
            logs: true,
          }
        );

        if (status.status === "COMPLETED") {
          const result = await fal.queue.result("fal-ai/minimax-video", {
            requestId: request_id,
          });

          const newVideo: VideoGeneration = {
            id: uuidv4(),
            prompt,
            image_url: imageUrl,
            video_url: result.data,
            timestamp: new Date(),
            style: advancedOptions.style,
            seed: advancedOptions.seed,
          };

          setGeneratedVideos((prev) => [newVideo, ...prev].slice(0, 20));
          setCurrentVideo(newVideo);
          setLoading(false);
        } else if (status.status === "IN_QUEUE") {
          setError("Video is generating");
          setLoading(false);
        } else {
          // Continue polling
          setTimeout(checkStatus, 5000);
        }
      };

      checkStatus();
    } catch (err: any) {
      setError(err.message || "Video generation failed");
      setLoading(false);
    }
  }, [prompt, imageUrl, advancedOptions]);

  const updateAdvancedOptions = useCallback(
    (options: Partial<VideoAdvancedOptions>) => {
      setAdvancedOptions((prev) => ({ ...prev, ...options }));
    },
    []
  );

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-hidden">
      <div className="min-h-screen bg-white">
        <div className="text-black font-extrabold text-2xl my-2">
          Minimax Video Hailuo
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Large Screen Layout */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-black backdrop-blur-md p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Advanced Settings
            </h2>
            {/* <VideoAdvancedSettings
              advancedOptions={advancedOptions}
              videoModels={videoModels}
              updateAdvancedOptions={updateAdvancedOptions}
            /> */}
          </aside>

          {/* Central Generation Area */}
          <main className="col-span-12 lg:col-span-6 space-y-6 rounded-xl">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              generateImage={generateVideo}
              loading={loading}
            />

            <VideoPreview currentVideo={currentVideo} />

            {/* Mobile & Tablet: Advanced Settings */}
            <div className="block lg:hidden bg-white border border-black backdrop-blur-md p-6 rounded-xl space-y-4 mt-4">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Advanced Settings
              </h2>
              {/* <VideoAdvancedSettings
                advancedOptions={advancedOptions}
                videoModels={videoModels}
                updateAdvancedOptions={updateAdvancedOptions}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
              /> */}
            </div>

            {/* Mobile & Tablet: Video History */}
            <div className="block lg:hidden bg-white border border-black backdrop-blur-md p-6 rounded-xl mt-4">
              <h3 className="text-xl font-semibold mb-4 text-black">
                Video History
              </h3>
              <VideoHistory videos={generatedVideos} />
            </div>

            {/* Loading & Error Handling */}
            {loading && (
              <div className="w-full bg-gray-800 p-4 rounded-xl mt-4 text-center">
                <p className="text-blue-300">
                  Generating video using Minimax Video Hailuo AI...
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

          {/* Large Screen Video History */}
          <aside className="hidden lg:block lg:col-span-3 border backdrop-blur-md px-3 py-2 rounded-xl">
            <div className="flex justify-center">
              <VideoHistory videos={generatedVideos} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
