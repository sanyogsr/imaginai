"use client";
import React from "react";
import { VideoGeneration } from "@/types";

interface VideoHistoryProps {
  videos: VideoGeneration[];
}

const VideoHistory: React.FC<VideoHistoryProps> = ({ videos }) => {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      {videos.length === 0 ? (
        <p className="text-gray-500 text-center">No videos generated yet</p>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="p-2 bg-gray-100">
              <p className="text-xs truncate">{video.prompt}</p>
            </div>
            <video
              src={video.video_url}
              className="w-full h-24 object-cover"
              muted
            />
          </div>
        ))
      )}
    </div>
  );
};

export default VideoHistory;
