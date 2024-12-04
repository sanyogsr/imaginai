import React from "react";

interface VideoPreviewProps {
  currentVideo: {
    videoUrl: string;
    prompt: string;
  } | null;
}

export function VideoPreview({ currentVideo }: VideoPreviewProps) {
  if (!currentVideo) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-xl">
        <p className="text-gray-500">Generated video will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <video
        src={currentVideo.videoUrl}
        controls
        className="w-full rounded-xl"
      />
      <p className="mt-2 text-sm text-gray-600 truncate">
        {currentVideo.prompt}
      </p>
    </div>
  );
}
