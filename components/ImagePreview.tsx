import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Camera,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Edit3,
  FlipHorizontal,
  ChevronRight,
  ChevronLeft,
  Download,
} from "lucide-react";
import { useImageStore } from "@/store/useImageStore";

interface ImageTransform {
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  brightness: number;
  contrast: number;
  position: { x: number; y: number };
}

interface PreviewState {
  transform: ImageTransform;
  isFullscreen: boolean;
  isDragging: boolean;
  dragStart: { x: number; y: number };
  showControls: boolean;
  selectedImageIndex: number;
  showMetadata: boolean;
  editMode: boolean;
  loading: boolean;
  error: string | null;
}

const defaultTransform: ImageTransform = {
  scale: 1,
  rotation: 0,
  flipX: false,
  flipY: false,
  brightness: 100,
  contrast: 100,
  position: { x: 0, y: 0 },
};

const EnhancedImagePreview: React.FC<{
  isGenerating?: boolean;
  progress?: number;
  isUploading?: boolean;
  generationComplete?: boolean;
}> = ({
  isGenerating = false,
  progress = 0,
  isUploading = false,
  generationComplete = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { currentImage, generatedImages, setCurrentImage } = useImageStore();

  const [state, setState] = useState<PreviewState>({
    transform: defaultTransform,
    isFullscreen: false,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    showControls: false,
    selectedImageIndex: 0,
    showMetadata: false,
    editMode: false,
    loading: false,
    error: null,
  });

  // Safely handle fullscreen changes
  const handleFullscreenChange = useCallback(() => {
    if (!document.fullscreenElement) {
      setState((prev) => ({ ...prev, isFullscreen: false }));
      document.body.style.overflow = "";
    }
  }, []);

  // Toggle fullscreen safely
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!containerRef.current) return;

      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        document.body.style.overflow = "hidden";
        setState((prev) => ({ ...prev, isFullscreen: true }));
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        document.body.style.overflow = "";
        setState((prev) => ({ ...prev, isFullscreen: false }));
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      setState((prev) => ({
        ...prev,
        error: "Fullscreen mode not supported",
        isFullscreen: false,
      }));
    }
  }, []);

  // Image manipulation functions
  const handleImageTransform = useCallback(
    (updates: Partial<ImageTransform>) => {
      setState((prev) => ({
        ...prev,
        transform: { ...prev.transform, ...updates },
      }));
    },
    []
  );

  const renderProgressBar = () => {
    if (!isGenerating && !isUploading && !generationComplete) return null;

    return (
      <div className="w-full max-w-md space-y-4 px-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {isUploading
              ? "Uploading image..."
              : isGenerating
              ? "Generating image..."
              : "Processing..."}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="space-y-2">
          {/* Generation Progress */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                isGenerating
                  ? "bg-blue-500"
                  : generationComplete
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
              style={{ width: isGenerating ? `${progress}%` : "100%" }}
            />
          </div>

          {/* Transition Line */}
          {generationComplete && !isUploading && (
            <div className="w-full h-8 flex items-center justify-center">
              <div className="w-0.5 h-full bg-gray-300 animate-pulse" />
            </div>
          )}

          {/* Upload Progress */}
          {(isUploading || generationComplete) && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out ${
                  isUploading ? "bg-blue-500" : "bg-gray-300"
                }`}
                style={{ width: isUploading ? `${progress}%` : "0%" }}
              />
            </div>
          )}
        </div>

        {/* Status Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span className={generationComplete ? "text-green-500" : ""}>
            Generation
          </span>
          <span className={isUploading ? "text-blue-500" : ""}>Upload</span>
        </div>
      </div>
    );
  };

  // const handleDownloads = useCallback(async () => {
  //   if (!currentImage) return;

  //   try {
  //     setState((prev) => ({ ...prev, loading: true }));

  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     const img = imageRef.current;

  //     if (!ctx || !img) return;

  //     canvas.width = img.naturalWidth;
  //     canvas.height = img.naturalHeight;

  //     ctx.translate(canvas.width / 2, canvas.height / 2);
  //     ctx.rotate((state.transform.rotation * Math.PI) / 180);
  //     ctx.scale(state.transform.flipX ? -1 : 1, state.transform.flipY ? -1 : 1);
  //     ctx.translate(-canvas.width / 2, -canvas.height / 2);

  //     ctx.filter = `brightness(${state.transform.brightness}%) contrast(${state.transform.contrast}%)`;
  //     ctx.drawImage(img, 0, 0);

  //     const link = document.createElement("a");
  //     link.download = `generated-image-${Date.now()}.png`;
  //     link.href = canvas.toDataURL("image/png");
  //     link.click();
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //     setState((prev) => ({ ...prev, error: "Download failed" }));
  //   } finally {
  //     setState((prev) => ({ ...prev, loading: false }));
  //   }
  // }, [currentImage, state.transform]);
  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert("Image downloaded successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to download image");
    }
  };
  // const handleNavigate = useCallback(
  //   (direction: "next" | "prev") => {
  //     if (!generatedImages.urls.length) return;

  //     setState((prev) => ({
  //       ...prev,
  //       selectedImageIndex:
  //         direction === "next"
  //           ? (prev.selectedImageIndex + 1) % generatedImages.urls.length
  //           : (prev.selectedImageIndex - 1 + generatedImages.urls.length) %
  //             generatedImages.urls.length,
  //       transform: defaultTransform,
  //     }));

  //     setCurrentImage(
  //       generatedImages.urls[
  //         direction === "next"
  //           ? (state.selectedImageIndex + 1) % generatedImages.urls.length
  //           : (state.selectedImageIndex - 1 + generatedImages.urls.length) %
  //             generatedImages.urls.length
  //       ]
  //     );
  //   },
  //   [generatedImages.urls, state.selectedImageIndex, setCurrentImage]
  // );

  // Set up event listeners
  const handleNavigate = useCallback(
    (direction: "next" | "prev") => {
      if (!generatedImages.urls.length) return;

      const newIndex =
        direction === "next"
          ? (state.selectedImageIndex + 1) % generatedImages.urls.length
          : (state.selectedImageIndex - 1 + generatedImages.urls.length) %
            generatedImages.urls.length;

      setState((prev) => ({
        ...prev,
        selectedImageIndex: newIndex,
        transform: defaultTransform,
      }));

      setCurrentImage(generatedImages.urls[newIndex]);
    },
    [generatedImages.urls, state.selectedImageIndex, setCurrentImage]
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) {
      // Threshold of 50px for swipe
      handleNavigate(diff > 0 ? "next" : "prev");
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!state.showControls) return;

      switch (e.key) {
        case "ArrowLeft":
          handleNavigate("prev");
          break;
        case "ArrowRight":
          handleNavigate("next");
          break;
        case "f":
          toggleFullscreen();
          break;
        case "r":
          handleImageTransform({ rotation: state.transform.rotation + 90 });
          break;
        case "Escape":
          setState((prev) => ({
            ...prev,
            editMode: false,
            showMetadata: false,
          }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.body.style.overflow = "";
    };
  }, [
    state.showControls,
    state.transform.rotation,
    handleNavigate,
    toggleFullscreen,
    handleFullscreenChange,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative ${
        state.isFullscreen
          ? "fixed inset-0 z-50 bg-black/90"
          : "aspect-square w-full"
      } 
        bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden
        transition-all duration-300`}
      onMouseEnter={() => setState((prev) => ({ ...prev, showControls: true }))}
      onMouseLeave={() =>
        setState((prev) => ({ ...prev, showControls: false }))
      }
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!currentImage && !isGenerating ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <Camera className="w-12 h-12 mb-4" />
          <p className="text-sm">Your creation will appear here</p>
        </div>
      ) : isGenerating || isUploading || generationComplete ? (
        <div className="h-full flex flex-col items-center justify-center">
          {renderProgressBar()}
        </div>
      ) : (
        <div className="relative w-full h-full">
          <img
            ref={imageRef}
            src={currentImage}
            alt="Generated preview"
            className={`w-full h-full object-contain transition-all duration-300 ${
              state.isFullscreen ? "max-h-screen" : ""
            }`}
            style={{
              transform: `
                translate(${state.transform.position.x}px, ${
                state.transform.position.y
              }px)
                scale(${state.transform.scale})
                rotate(${state.transform.rotation}deg)
                scaleX(${state.transform.flipX ? -1 : 1})
                scaleY(${state.transform.flipY ? -1 : 1})
              `,
              filter: `brightness(${state.transform.brightness}%) contrast(${state.transform.contrast}%)`,
            }}
          />

          {/* Navigation Arrows - Desktop */}
          {generatedImages.urls.length > 1 && (
            <>
              <button
                onClick={() => handleNavigate("prev")}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleNavigate("next")}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Navigation Dots - Mobile */}
          {generatedImages.urls.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
              {generatedImages.urls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      selectedImageIndex: index,
                    }));
                    setCurrentImage(generatedImages.urls[index]);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === state.selectedImageIndex
                      ? "bg-blue-500 w-4"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Control Panel */}
          {state.showControls && !isGenerating && (
            <div
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm
                rounded-lg shadow-lg p-2 flex items-center gap-2 transition-opacity duration-200
                ${state.isFullscreen ? "z-50" : ""}`}
            >
              <button
                onClick={() =>
                  handleImageTransform({ scale: state.transform.scale + 0.1 })
                }
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  handleImageTransform({ scale: state.transform.scale - 0.1 })
                }
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  handleImageTransform({
                    rotation: state.transform.rotation + 90,
                  })
                }
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Rotate"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  handleImageTransform({ flipX: !state.transform.flipX })
                }
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Flip horizontal"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-300" />
              {/* <button
                onClick={handleDownload(items.url)}
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button> */}
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, editMode: !prev.editMode }))
                }
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Edit"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg tooltip"
                title="Toggle fullscreen"
              >
                {state.isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          )}

          {/* Edit Mode Panel */}
          {state.editMode && (
            <div
              className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg 
                shadow-lg p-4 space-y-4 ${state.isFullscreen ? "z-50" : ""}`}
            >
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={state.transform.brightness}
                  onChange={(e) =>
                    handleImageTransform({ brightness: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={state.transform.contrast}
                  onChange={(e) =>
                    handleImageTransform({ contrast: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleImageTransform(defaultTransform)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, editMode: false }))
                  }
                  className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Loading and Error States */}
          {state.loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
            </div>
          )}

          {state.error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
              {state.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedImagePreview;
