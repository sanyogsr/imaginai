"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useImageStore } from "@/store/fal/useImageStore";

interface EnhancedImagePreviewProps {
  isGenerating: boolean;
  progress: number;
  generationComplete: boolean;
}

const EnhancedImagePreview: React.FC<EnhancedImagePreviewProps> = ({
  isGenerating,
  progress,
  generationComplete,
}) => {
  const { currentImage, downloadCurrentImage } = useImageStore();
  const [rotate, setRotate] = useState(0);
  const [flip, setFlip] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  const handleRotate = () => setRotate((prev) => prev + 90);
  const handleFlip = () => setFlip((prev) => !prev);
  const handleBrightness = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBrightness(parseInt(e.target.value, 10));
  const handleSaturation = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSaturation(parseInt(e.target.value, 10));
  const toggleFullscreen = () => setFullscreen((prev) => !prev);

  if (isGenerating) {
    return <div className="text-center">Generating image... {progress}%</div>;
  }

  if (!generationComplete || !currentImage) {
    return <div className="text-center">No image generated yet.</div>;
  }

  return (
    <div
      className={`relative group ${
        fullscreen
          ? "fixed inset-0 z-50 bg-black flex items-center justify-center"
          : ""
      }`}
    >
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1})`,
          filter: `brightness(${brightness}%) saturate(${saturation}%)`,
        }}
      >
        <Image
          src={currentImage}
          alt="Generated Image"
          width={500}
          height={500}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Hover controls */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
        <div className="space-x-3 text-white text-sm flex items-center">
          <button
            onClick={handleRotate}
            className="px-3 py-1 bg-indigo-600 rounded-lg"
          >
            Rotate
          </button>
          <button
            onClick={handleFlip}
            className="px-3 py-1 bg-indigo-600 rounded-lg"
          >
            Flip
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-indigo-600 rounded-lg"
          >
            {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            onClick={downloadCurrentImage}
            className="px-3 py-1 bg-indigo-600 rounded-lg"
          >
            Download
          </button>
        </div>
      </div>

      {/* Brightness and Saturation Controls */}
      <div className="flex flex-col gap-2 mt-2">
        <label className="flex items-center">
          Brightness:
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={handleBrightness}
            className="ml-2 w-full"
          />
        </label>
        <label className="flex items-center">
          Saturation:
          <input
            type="range"
            min="50"
            max="150"
            value={saturation}
            onChange={handleSaturation}
            className="ml-2 w-full"
          />
        </label>
      </div>
    </div>
  );
};

export default EnhancedImagePreview;
