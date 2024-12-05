import React, { useRef, useState } from "react";
import {
  ChevronDownIcon,
  DownloadIcon,
  PauseCircleIcon,
  VolumeIcon,
  FullscreenIcon,
  Play,
} from "lucide-react";

interface VideoPreviewProps {
  currentVideo: {
    videoUrl: string;
    prompt: string;
  } | null;
}

export function VideoPreview({ currentVideo }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleProgressUpdate = () => {
    if (videoRef.current) {
      const progressPercent =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressPercent);
    }
  };

  const handleDownload = () => {
    if (currentVideo) {
      const link = document.createElement("a");
      link.href = currentVideo.videoUrl;
      link.download = "downloaded-video.mp4";
      link.click();
    }
  };

  if (!currentVideo) {
    return (
      <div className="w-full aspect-video bg-black/10 flex items-center justify-center rounded-3xl border-2 border-dashed border-pink-300 animate-pulse">
        <p className="text-pink-600 font-bold text-lg">
          waiting for that viral moment...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      <div className="absolute z-10 top-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={handleDownload}
          className="bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition-all"
        >
          <DownloadIcon className="text-white" size={20} />
        </button>
      </div>

      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src={currentVideo.videoUrl}
          className="w-full rounded-3xl"
          onTimeUpdate={handleProgressUpdate}
        />

        <div className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-sm p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="text-white hover:scale-110 transition-all"
            >
              {isPlaying ? <PauseCircleIcon /> : <Play />}
            </button>

            <div className="flex-grow relative h-1 bg-white/30 rounded-full">
              <div
                className="absolute left-0 top-0 h-1 bg-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <VolumeIcon className="text-white" size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-pink-500"
              />
            </div>

            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="text-white hover:scale-110 transition-all"
            >
              <FullscreenIcon />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600 bg-pink-50 px-3 py-1 rounded-full truncate flex items-center">
        <ChevronDownIcon size={16} className="mr-2 text-pink-500" />
        {currentVideo.prompt}
      </p>
    </div>
  );
}
