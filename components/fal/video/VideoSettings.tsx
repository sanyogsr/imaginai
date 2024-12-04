"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  VideoAdvancedOptions,
  VideoGeneration,
  VideoModelConfig,
} from "@/types";
import {
  Download,
  Play,
  Pause,
  Maximize2,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
export interface VideoPreviewProps {
  currentVideo: VideoGeneration | null;
  advancedOptions?: VideoAdvancedOptions;
  videoModels?: VideoModelConfig[];
  updateAdvancedOptions?: (options: Partial<VideoAdvancedOptions>) => void;
}

export const VideoAdvanceSettingProps: React.FC<VideoPreviewProps> = ({
  currentVideo,
  advancedOptions,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      const elem = containerRef.current;
      if (elem) {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if ((elem as any).mozRequestFullScreen)
          (elem as any).mozRequestFullScreen();
        else if ((elem as any).webkitRequestFullscreen)
          (elem as any).webkitRequestFullscreen();
        else if ((elem as any).msRequestFullscreen)
          (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).mozCancelFullScreen)
        (document as any).mozCancelFullScreen();
      else if ((document as any).webkitExitFullscreen)
        (document as any).webkitExitFullscreen();
      else if ((document as any).msExitFullscreen)
        (document as any).msExitFullscreen();
    }
  }, [isFullScreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const progressPercent =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressPercent);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (currentVideo?.video_url) {
      const link = document.createElement("a");
      link.href = currentVideo.video_url;
      link.download = `AI_Video_${new Date().toISOString()}.mp4`;
      link.click();
    }
  }, [currentVideo]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center"
    >
      {currentVideo?.video_url ? (
        <>
          <video
            ref={videoRef}
            src={currentVideo.video_url}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            muted={isMuted}
          />

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-4">
              {[
                {
                  Icon: isPlaying ? Pause : Play,
                  action: handlePlayPause,
                },
                {
                  Icon: isMuted ? VolumeX : Volume2,
                  action: () => setIsMuted(!isMuted),
                },
                {
                  Icon: Download,
                  action: handleDownload,
                },
                {
                  Icon: Maximize2,
                  action: handleFullScreen,
                },
              ].map(({ Icon, action }) => (
                <button
                  key={crypto.randomUUID()}
                  onClick={action}
                  className="bg-white/20 hover:bg-white/40 p-3 rounded-full"
                >
                  <Icon className="text-white w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Your video masterpiece awaits...</p>
      )}
    </div>
  );
};

export default VideoAdvanceSettingProps;
