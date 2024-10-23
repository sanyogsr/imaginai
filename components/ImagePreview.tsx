// components/dashboard/ImagePreview.tsx
import React from "react";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImagePreviewProps {
  imageUrl?: string;
  alt?: string;
  onDownload?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  alt = "Generated image",
  onDownload,
}) => {
  return (
    <div className="relative flex items-center justify-center bg-gray-50 rounded-xl w-full h-full min-h-[400px] group">
      {!imageUrl ? (
        <div className="flex flex-col items-center justify-center text-gray-300">
          <ImageIcon size={48} />
          <p className="mt-2 text-sm">No image generated yet</p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt={alt}
              layout="fill"
              objectFit="contain"
              className="rounded-xl"
            />
          </div>
          {onDownload && (
            <button
              onClick={onDownload}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Download</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};
