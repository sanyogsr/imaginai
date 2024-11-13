"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Download,
  ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useImageStore } from "@/store/useImageStore";
import { ImagePreviewProps } from "@/types";
import { cn } from "@/utils/cn";
import { useImageDownload } from "@/utils/useImageDownload";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useSession } from "next-auth/react";

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  onFullscreen,
  // className,
}) => {
  const { handleDownload, downloadProgress } = useImageDownload();
  const { history, fetchHistory } = useHistoryStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentImage, generatedImages, setCurrentImage } = useImageStore();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.id) {
      fetchHistory(session.data.user.id);
    }
  }, [fetchHistory, session]);

  // Handles going to the next image
  const handleNext = useCallback(() => {
    if (!currentImage || generatedImages.urls.length <= 1) return;
    const currentIndex = generatedImages.urls.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % generatedImages.urls.length;
    setCurrentImage(generatedImages.urls[nextIndex]);
  }, [currentImage, generatedImages, setCurrentImage]);

  const getCurrentHistoryItem = useCallback(() => {
    if (!currentImage || !history.length) return null;
    return history.find((item) => item.imageUrls[0] === currentImage);
  }, [currentImage, history]);

  // Handles going to the previous image
  const handlePrevious = useCallback(() => {
    if (!currentImage || generatedImages.urls.length <= 1) return;
    const currentIndex = generatedImages.urls.indexOf(currentImage);
    const prevIndex =
      (currentIndex - 1 + generatedImages.urls.length) %
      generatedImages.urls.length;
    setCurrentImage(generatedImages.urls[prevIndex]);
  }, [currentImage, generatedImages, setCurrentImage]);

  // Toggles fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    if (onFullscreen) onFullscreen();
  }, [onFullscreen]);

  const currentHistoryItem = getCurrentHistoryItem();

  return (
    <>
      <div
        className={cn(
          "relative flex items-center justify-center bg-gray-50 rounded-xl w-full h-full min-h-[400px] group"
          // className
        )}
      >
        {!currentImage ? (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <ImageIcon size={48} />
            <p className="mt-2 text-sm">No image </p>
          </div>
        ) : (
          <>
            <div className="relative w-full h-full">
              <div
                className={cn(
                  "absolute inset-0 bg-gray-100",
                  isImageLoading ? "animate-pulse" : "hidden"
                )}
              />
              <Image
                src={currentImage}
                alt="Generated image"
                layout="fill"
                objectFit="contain"
                className={cn(
                  "rounded-xl transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoadingComplete={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>

            {generatedImages.urls.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={toggleFullscreen}
                className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
              >
                <Maximize2 size={20} />
                <span>Fullscreen</span>
              </button>
              {currentHistoryItem && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(
                      currentHistoryItem.imageUrls[0],
                      currentHistoryItem.id
                    );
                  }}
                  className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>{downloadProgress ? `Download` : "Download"}</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && currentImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-full">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg z-10"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full">
              <div
                className={cn(
                  "absolute inset-0 bg-gray-100",
                  isImageLoading ? "animate-pulse" : "hidden"
                )}
              />
              <Image
                src={currentImage}
                alt="Generated image"
                layout="fill"
                objectFit="contain"
                className={cn(
                  "rounded-xl transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoadingComplete={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>

            {generatedImages.urls.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
