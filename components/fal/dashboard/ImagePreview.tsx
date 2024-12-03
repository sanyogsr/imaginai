"use client";
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { ImageGeneration } from "@/types";

// Advanced icon library (simulating lucide-react style)
import {
  Download,
  RotateCw,
  FlipHorizontal,
  Sun,
  Contrast,
  Palette,
  Maximize2,
  Filter,
  Baseline,
  Brush,
  Scaling,
  SeparatorVertical,
  PaintBucket,
} from "lucide-react";

interface ImagePreviewProps {
  currentImage: ImageGeneration | null;
}

interface ImageManipulationState {
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  zoom: number;
  hue: number;
  blur: number;
  sepia: number;
  invert: boolean;
  pixelate: number;
  grayscale: number;
  perspective: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ currentImage }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "transform" | "filters" | "effects"
  >("transform");
  const [manipulationState, setManipulationState] =
    useState<ImageManipulationState>({
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      zoom: 100,
      hue: 0,
      blur: 0,
      sepia: 0,
      invert: false,
      pixelate: 0,
      grayscale: 0,
      perspective: 0,
    });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced full-screen handling
  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      // Enter full-screen
      const elem = containerRef.current;
      if (elem) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((elem as any).mozRequestFullScreen) {
          // Firefox
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (elem as any).mozRequestFullScreen();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((elem as any).webkitRequestFullscreen) {
          // Chrome, Safari
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (elem as any).webkitRequestFullscreen();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((elem as any).msRequestFullscreen) {
          // IE/Edge
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (elem as any).msRequestFullscreen();
        }
      }
      setIsFullScreen(true);
    } else {
      // Exit full-screen
      if (document.exitFullscreen) {
        document.exitFullscreen();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((document as any).mozCancelFullScreen) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).mozCancelFullScreen();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((document as any).webkitExitFullscreen) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).webkitExitFullscreen();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((document as any).msExitFullscreen) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  }, [isFullScreen]);

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Advanced transformation calculation
  const imageTransformStyle = useMemo(
    () => ({
      transform: `
        rotate(${manipulationState.rotation}deg) 
        scaleX(${manipulationState.flipHorizontal ? -1 : 1})
        scaleY(${manipulationState.flipVertical ? -1 : 1})
        scale(${manipulationState.zoom / 100})
        perspective(${manipulationState.perspective}px)
      `,
      filter: `
        brightness(${manipulationState.brightness}%) 
        contrast(${manipulationState.contrast}%) 
        saturate(${manipulationState.saturation}%) 
        hue-rotate(${manipulationState.hue}deg)
        blur(${manipulationState.blur}px)
        sepia(${manipulationState.sepia}%)
        grayscale(${manipulationState.grayscale}%)
        ${manipulationState.invert ? "invert(100%)" : ""}
      `,
      willChange: "transform, filter",
    }),
    [manipulationState]
  );

  // Advanced image analysis and metadata extraction
  const extractImageMetadata = useCallback(() => {
    if (!imageRef.current) return null;

    return {
      dimensions: {
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      },
      fileSize: currentImage
        ? (currentImage.image.length / 1024).toFixed(2) + " KB"
        : "N/A",
      aspectRatio:
        imageRef.current.naturalWidth / imageRef.current.naturalHeight,
    };
  }, [currentImage]);

  // Advanced color palette extraction (simulated)
  //   const extractColorPalette = useCallback(() => {
  //     // In a real-world scenario, this would use canvas to sample colors
  //     return [
  //       "#FF0000", // Red
  //       "#00FF00", // Green
  //       "#0000FF", // Blue
  //       "#FFFF00", // Yellow
  //       "#FF00FF", // Magenta
  //     ];
  //   }, [currentImage]);

  // Advanced parameter slider component
  const AdvancedSlider = ({
    label,
    value,
    min = 0,
    max = 200,
    step = 1,
    onChange,
    icon: Icon,
  }: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (val: number) => void;
    icon: React.ElementType;
  }) => (
    <div className="flex flex-col space-y-2 p-2 bg-gray-700 rounded">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-gray-300" />
          <span className="text-xs text-gray-300">{label}</span>
        </div>
        <span className="text-sm text-white">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  // Advanced controls rendering
  const renderAdvancedControls = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
      <div className="flex space-x-4 mb-4">
        {[
          { key: "transform", label: "Transform", icon: Scaling },
          { key: "filters", label: "Filters", icon: Filter },
          { key: "effects", label: "Effects", icon: Brush },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setActivePanel(key as any)}
            className={`
                flex items-center space-x-2 px-3 py-2 rounded
                ${
                  activePanel === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
              `}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {activePanel === "transform" &&
          [
            {
              icon: Sun,
              label: "Zoom",
              value: manipulationState.zoom,
              onChange: (val: number) =>
                setManipulationState((prev) => ({ ...prev, zoom: val })),
            },
            {
              icon: Contrast,
              label: "Perspective",
              value: manipulationState.perspective,
              onChange: (val: number) =>
                setManipulationState((prev) => ({ ...prev, perspective: val })),
            },
          ].map((item) => <AdvancedSlider key={item.label} {...item} />)}

        {activePanel === "filters" &&
          [
            {
              icon: Palette,
              label: "Saturation",
              value: manipulationState.saturation,
              onChange: (val: number) =>
                setManipulationState((prev) => ({ ...prev, saturation: val })),
            },
            {
              icon: PaintBucket,
              label: "Hue",
              value: manipulationState.hue,
              onChange: (val: number) =>
                setManipulationState((prev) => ({ ...prev, hue: val })),
            },
          ].map((item) => <AdvancedSlider key={item.label} {...item} />)}

        {activePanel === "effects" &&
          [
            {
              icon: Baseline,
              label: "Grayscale",
              value: manipulationState.grayscale,
              onChange: (val: number) =>
                setManipulationState((prev) => ({ ...prev, grayscale: val })),
            },
            {
              icon: SeparatorVertical,
              label: "Sepia",
              value: manipulationState.sepia,
              onChange: (val: number) =>
                setManipulationState((prev) => ({ ...prev, sepia: val })),
            },
          ].map((item) => <AdvancedSlider key={item.label} {...item} />)}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`
          relative aspect-square bg-gray-800 rounded-2xl overflow-hidden 
          flex items-center justify-center transition-all duration-300
        `}
    >
      {currentImage ? (
        <>
          <img
            ref={imageRef}
            src={currentImage.image}
            alt="Generated AI Artwork"
            style={imageTransformStyle}
            className="w-full h-full object-contain cursor-move"
          />

          {/* Top Right Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {[
              {
                Icon: RotateCw,
                action: () =>
                  setManipulationState((prev) => ({
                    ...prev,
                    rotation: (prev.rotation + 90) % 360,
                  })),
              },
              {
                Icon: FlipHorizontal,
                action: () =>
                  setManipulationState((prev) => ({
                    ...prev,
                    flipHorizontal: !prev.flipHorizontal,
                  })),
              },
              {
                Icon: Download,
                action: () => {
                  const link = document.createElement("a");
                  link.href = currentImage.image;
                  link.download = `AI_Artwork_${new Date().toISOString()}.png`;
                  link.click();
                },
              },
              {
                Icon: Maximize2,
                action: handleFullScreen,
              },
            ].map(({ Icon, action }) => (
              <button
                key={crypto.randomUUID()}
                onClick={action}
                className="bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all"
              >
                <Icon className="text-white w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Additional Metadata Display */}
          <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-white text-xs">
            {(() => {
              const metadata = extractImageMetadata();
              return metadata ? (
                <>
                  <div>
                    Dimensions: {metadata.dimensions.width} x{" "}
                    {metadata.dimensions.height}
                  </div>
                  <div>File Size: {metadata.fileSize}</div>
                  <div>Aspect Ratio: {metadata.aspectRatio.toFixed(2)}</div>
                </>
              ) : null;
            })()}
          </div>

          {renderAdvancedControls()}
        </>
      ) : (
        <p className="text-gray-500">Your masterpiece awaits...</p>
      )}
    </div>
  );
};

export default ImagePreview;
