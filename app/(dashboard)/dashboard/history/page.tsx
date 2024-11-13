"use client";
import React, { useState, useEffect } from "react";
import {
  Download,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/HistoryDIalog";
import { useHistoryStore, HistoryItem } from "@/store/useHistoryStore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useImageDownload } from "@/utils/useImageDownload";

const ImageHistoryPage = () => {
  const { history, removeFromHistory, clearHistory, isLoading, fetchHistory } =
    useHistoryStore();
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  // const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { handleDownload, downloadProgress } = useImageDownload();

  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.id) {
      fetchHistory(session.data.user.id);
    }
  }, [fetchHistory, session]);

  const handleImageClick = (image: HistoryItem, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentImageIndex - 1 + history.length) % history.length
        : (currentImageIndex + 1) % history.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(history[newIndex]);
  };

  const handleDeleteImage = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
      removeFromHistory(id);
      toast.success("Image deleted successfully");
    } catch (e) {
      toast.error(`Failed to delete image${e}`);
    }
  };

  const renderImageCard = (item: HistoryItem, index: number) => (
    <div
      key={item.id}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
               transform hover:-translate-y-1"
    >
      <div
        className="aspect-square cursor-pointer overflow-hidden rounded-t-2xl"
        onClick={() => handleImageClick(item, index)}
      >
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <img
            src={item.imageUrls[0]}
            alt={item.prompt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>

      {/* Overlay Controls */}
      <div
        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300
                  rounded-t-2xl flex items-center justify-center"
      >
        <div className="flex gap-3">
          <button
            // onClick={(e) => {
            //   e.stopPropagation();
            //   handleDownload(
            //     item.imageUrls[0]

            //     // item.id
            //   );
            // }}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(item.imageUrls[0], item.id);
            }}
            disabled={downloadProgress[item.id]}
            className="p-3 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-200 shadow-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadProgress[item.id] ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(item, index);
            }}
            className="p-3 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => handleDeleteImage(item.id, e)}
            className="p-3 bg-white rounded-full hover:bg-gray-100 transform hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <p className="text-sm text-gray-500 mb-2">{item.timestamp}</p>
        <p className="text-gray-900 font-medium line-clamp-2 mb-4">
          {item.prompt}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: item.model, color: "purple" },
            { label: item.size, color: "blue" },
            { label: item.quality, color: "green" },
            { label: item.style, color: "orange" },
          ].map((tag, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 bg-${tag.color}-100 text-${tag.color}-600
                        rounded-full text-sm font-medium transition-transform hover:scale-105`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b mt-16 from-gray-50 to-gray-100 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Creative Gallery
            </h1>
            <p className="text-lg text-gray-600">
              Your AI-generated masterpiece collection
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to clear all history?")
                ) {
                  clearHistory();
                  setSelectedImage(null);
                  toast.success("Gallery cleared successfully");
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-red-600 text-white rounded-full
                       transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Clear All</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl shadow-sm">
            <Loader2 className="w-16 h-16 text-gray-300 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Images...
            </h3>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Images Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Start creating amazing AI-generated artwork to build your
              collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {history.map((item, index) => renderImageCard(item, index))}
          </div>
        )}

        {/* Full Screen Image Dialog */}
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          className="max-w-[95vw] w-full"
        >
          <DialogContent className="bg-black/95 border-none p-0">
            <div className="relative h-[90vh] flex items-center justify-center">
              {/* Navigation Buttons */}
              {history.length > 1 &&
                ["prev", "next"].map((direction) => (
                  <button
                    key={direction}
                    onClick={() => handleNavigate(direction as "prev" | "next")}
                    className={`absolute ${
                      direction === "prev" ? "left-4" : "right-4"
                    }
                           p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300
                           transform hover:scale-110 z-10`}
                  >
                    {direction === "prev" ? (
                      <ChevronLeft className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-white" />
                    )}
                  </button>
                ))}

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full
                         transition-all duration-300 transform hover:scale-110 z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Selected Image Display */}
              {selectedImage && (
                <>
                  <img
                    src={selectedImage.imageUrls[0]}
                    alt={selectedImage.prompt}
                    className="max-h-full max-w-full object-contain px-4"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 sm:p-8">
                    <p className="text-white text-lg sm:text-xl mb-4 line-clamp-2">
                      {selectedImage.prompt}
                    </p>
                    <div className="flex flex-wrap gap-4 items-center">
                      <button
                        // onClick={() =>
                        //   handleDownload(
                        //     selectedImage.imageUrls[0]
                        //     // selectedImage.id
                        //   )
                        // }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(
                            selectedImage.imageUrls[0],
                            selectedImage.id
                          );
                        }}
                        disabled={downloadProgress[selectedImage.id]}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full
                               hover:bg-gray-100 transition-all duration-300 transform hover:scale-105
                               disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => handleDeleteImage(selectedImage.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full
                               hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      <span className="text-white/70 text-sm">
                        {selectedImage.timestamp}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImageHistoryPage;
