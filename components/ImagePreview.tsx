import React, { useState, useCallback } from "react";
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

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  onFullscreen,
  className,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentImage, generatedImages, setCurrentImage } = useImageStore();
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Handles image download
  const handleDownload = useCallback(async () => {
    if (!currentImage) return;
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  }, [currentImage]);

  // Handles going to the next image
  const handleNext = useCallback(() => {
    if (!currentImage || generatedImages.length <= 1) return;
    const currentIndex = generatedImages.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % generatedImages.length;
    setCurrentImage(generatedImages[nextIndex]);
  }, [currentImage, generatedImages, setCurrentImage]);

  // Handles going to the previous image
  const handlePrevious = useCallback(() => {
    if (!currentImage || generatedImages.length <= 1) return;
    const currentIndex = generatedImages.indexOf(currentImage);
    const prevIndex =
      (currentIndex - 1 + generatedImages.length) % generatedImages.length;
    setCurrentImage(generatedImages[prevIndex]);
  }, [currentImage, generatedImages, setCurrentImage]);

  // Toggles fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    if (onFullscreen) onFullscreen();
  }, [onFullscreen]);

  return (
    <>
      <div
        className={cn(
          "relative flex items-center justify-center bg-gray-50 rounded-xl w-full h-full min-h-[400px] group",
          className as string
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
                objectFit="contain" // Ensures the image fits in the container
                className={cn(
                  "rounded-xl transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoadingComplete={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>

            {generatedImages.length > 1 && (
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
              <button
                onClick={handleDownload}
                className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Download</span>
              </button>
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
                objectFit="contain" // Fit the image to the container
                className={cn(
                  "rounded-xl transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoadingComplete={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>

            {generatedImages.length > 1 && (
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
