import React from "react";
import { Clock, Video } from "lucide-react";

const VideoHistorySidebar = ({ videos, setCurrentVideo }: any) => {
  return (
    <aside className="bg-[#121212] text-white p-4 rounded-2xl shadow-xl border border-[#333] transition-all duration-300 hover:border-[#444]">
      <div className="flex items-center mb-4 space-x-2">
        <Video className="text-[#00ff88] w-6 h-6" />
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ff88] to-[#00ccff]">
          Video Vault
        </h2>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
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
            className="group bg-[#1e1e1e] hover:bg-[#2a2a2a] rounded-xl p-3 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#00ff88] group-hover:text-[#00ccff] transition-colors duration-200 line-clamp-1">
                {video.prompt}
              </p>
              <Clock className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(video.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          <p>No videos yet 🎥</p>
        </div>
      )}
    </aside>
  );
};

export default VideoHistorySidebar;
