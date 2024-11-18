import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  MessageCircle,
  Trash2,
  X,
} from "lucide-react";
import { Dialog, DialogContent } from "../HistoryDIalog";
import { useState } from "react";
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

export const FullScreenViewer: React.FC<{
  selectedImage: HistoryItem | null;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  onDelete: (id: number) => Promise<void>;
  downloadProgress: Record<number, boolean>;
  handleDownload: (url: string, id: number) => void;
}> = ({
  selectedImage,
  onClose,
  onNavigate,
  onDelete,
  downloadProgress,
  handleDownload,
}) => {
  const [showInfo, setShowInfo] = useState(true);

  if (!selectedImage) return null;

  return (
    <Dialog
      open={!!selectedImage}
      onClose={onClose}
      className="max-w-[95vw] w-full"
    >
      <DialogContent className="bg-black/95 border-none p-0">
        <div className="relative h-[90vh] flex items-center justify-center">
          {/* Navigation */}
          {["prev", "next"].map((direction) => (
            <button
              key={direction}
              onClick={() => onNavigate(direction as "prev" | "next")}
              className={`absolute ${
                direction === "prev" ? "left-4" : "right-4"
              } p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300
                  transform hover:scale-110 backdrop-blur-md z-10`}
            >
              {direction === "prev" ? (
                <ChevronLeft className="w-6 h-6 text-white" />
              ) : (
                <ChevronRight className="w-6 h-6 text-white" />
              )}
            </button>
          ))}

          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300
                         backdrop-blur-md"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300
                         backdrop-blur-md"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image */}
          <img
            src={selectedImage.imageUrls[0]}
            alt={selectedImage.prompt}
            className="max-h-full max-w-full object-contain px-4"
          />

          {/* Info Panel */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent
                         transition-all duration-500 ${
                           showInfo ? "h-48 opacity-100" : "h-0 opacity-0"
                         }`}
          >
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white text-xl font-medium mb-4 line-clamp-2">
                {selectedImage.prompt}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() =>
                    handleDownload(selectedImage.imageUrls[0], selectedImage.id)
                  }
                  disabled={downloadProgress[selectedImage.id]}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium
                             hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  {downloadProgress[selectedImage.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
                <button
                  onClick={() => onDelete(selectedImage.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-medium
                             hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                {/* <button
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-medium
                                   hover:bg-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-md"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
