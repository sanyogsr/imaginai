import {
  Download,
  Heart,
  ImageIcon,
  Loader2,
  MessageCircle,
  Trash2,
} from "lucide-react";
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

interface ImageCardProps {
  item: HistoryItem;
  index: number;
  onImageClick: (image: HistoryItem, index: number) => void;
  onDelete: (id: number, e?: React.MouseEvent) => Promise<void>;
  downloadProgress: Record<number, boolean>;
  handleDownload: (url: string, id: number) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  index,
  onImageClick,
  onDelete,
  downloadProgress,
  handleDownload,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500
                   transform hover:-translate-y-2 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="aspect-[4/5] cursor-pointer overflow-hidden"
        onClick={() => onImageClick(item, index)}
      >
        {item.imageUrls?.[0] ? (
          <img
            src={item.imageUrls[0]}
            alt={item.prompt}
            className={`w-full h-full object-cover transition-all duration-700 
                         ${isHovered ? "scale-110 blur-[2px]" : "scale-100"}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Floating Stats - Now with higher z-index */}
      <div
        className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 z-20
                     ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-300
                       ${
                         isLiked
                           ? "bg-red-500 text-white"
                           : "bg-white/70 hover:bg-white"
                       }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-md transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Overlay Content - Now with lower z-index */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all duration-500 flex flex-col justify-between p-6 z-10
                      ${
                        isHovered
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className="text-white/70 text-sm">{item.timestamp}</span>
            <p className="text-white font-medium line-clamp-2 text-lg">
              {item.prompt}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: item.model, color: "purple" },
              { label: item.size, color: "blue" },
              { label: item.style, color: "orange" },
            ].map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/10 text-white rounded-full text-sm 
                            backdrop-blur-md transition-transform hover:scale-105"
              >
                {tag.label}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(item.imageUrls[0], item.id);
              }}
              disabled={downloadProgress[item.id]}
              className="flex-1 py-2 bg-white text-black rounded-full font-medium
                         hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadProgress[item.id] ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download
            </button>
            <button
              onClick={(e) => onDelete(item.id, e)}
              className="flex-1 py-2 bg-red-500 text-white rounded-full font-medium
                         hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
