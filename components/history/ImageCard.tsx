import React, { useState } from "react";
import {
  Download,
  Maximize,
  Eye,
  Trash2,
  ImageIcon,
  Loader2,
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
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-[4/5] relative cursor-default overflow-hidden">
        {item.imageUrls?.[0] ? (
          <img
            src={item.imageUrls[0]}
            alt={item.prompt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Overlay with Actions */}
        <div
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => onImageClick(item, index)}
            className="bg-white/90 p-3 rounded-full hover:bg-white 
              transition-colors flex items-center justify-center"
            aria-label="View Fullscreen"
          >
            <Eye className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(item.imageUrls[0], item.id);
            }}
            disabled={downloadProgress[item.id]}
            className="bg-white/90 p-3 rounded-full hover:bg-white 
              transition-colors flex items-center justify-center"
            aria-label="Download"
          >
            {downloadProgress[item.id] ? (
              <Loader2 className="w-5 h-5 text-gray-800 animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Image Details */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {item.prompt}
          </h3>
          <button
            onClick={toggleDetails}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {isDetailsVisible && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="font-medium">{item.model}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{item.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Style:</span>
              <span className="font-medium">{item.style}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="font-medium">{item.timestamp}</span>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id, e);
                }}
                className="w-full py-2 bg-red-500 text-white rounded-lg 
                  hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
