import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

interface HistoryItem {
  id: number;
  imageUrls: string[];
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
  likes?: number;
  comments?: number;
}

interface FullScreenViewerProps {
  selectedImage: HistoryItem | null;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  onDelete: (id: number) => Promise<void>;
  downloadProgress: Record<number, boolean>;
  handleDownload: (url: string, id: number) => void;
}

const FullScreenViewer: React.FC<FullScreenViewerProps> = ({
  selectedImage,
  onClose,
  onNavigate,
  onDelete,
  downloadProgress,
  handleDownload,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate("prev");
      if (e.key === "ArrowRight") onNavigate("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      onNavigate(diff > 0 ? "next" : "prev");
    }
    setTouchStart(null);
  };

  if (!selectedImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={() => setShowControls(!showControls)}
    >
      {/* Navigation Buttons */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 
        transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("prev");
          }}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 
                     transition-colors text-white"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("next");
          }}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 
                     transition-colors text-white"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Top Controls */}
      <div
        className={`absolute top-0 inset-x-0 p-4 flex justify-end
          transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 
                     transition-colors text-white"
          aria-label="Close viewer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Image */}
      <div
        className="w-full h-full flex items-center justify-center p-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={selectedImage.imageUrls[0]}
          alt={selectedImage.prompt}
          className="max-h-full max-w-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent
          transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="p-4 sm:p-6">
          <p className="text-white text-sm sm:text-base mb-4 line-clamp-2">
            {selectedImage.prompt}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage.imageUrls[0], selectedImage.id);
              }}
              disabled={downloadProgress[selectedImage.id]}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white text-black 
                       rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              {downloadProgress[selectedImage.id] ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(selectedImage.id);
              }}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white 
                       rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenViewer;
