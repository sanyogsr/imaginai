import React from "react";
import { Select } from "./Select";
import { useSettingsStore } from "@/store/useSettingsStore";

export const SettingsPanel = () => {
  const {
    model,
    size,
    quality,
    numberOfImages,
    updateSetting,
    setNumberOfImages,
  } = useSettingsStore();

  const modelOptions = [
    { value: "black-forest-labs/FLUX.1-schnell", label: "Flux schnell" },
    { value: "black-forest-labs/FLUX.1-dev", label: "Flux dev" },
    { value: "black-forest-labs/FLUX.1.1-pro", label: "Flux.1.1 Pro" },
  ];

  const sizeOptions = [
    { value: "896x1600", label: "Instagram Story (900x1600)" }, // Adjusted from 900x1600
    { value: "1088x1088", label: "Instagram (1080x1080)" }, // Adjusted from 1080x1080
    { value: "1200x624", label: "Facebook (1200x628)" }, // Adjusted from 1200x628
    { value: "1024x1024", label: "Square (1024x1024)" }, // Already compliant
    { value: "1600x896", label: "YouTube thumbnail (1600x900)" }, // Adjusted from 1600x900
    { value: "1280x720", label: "HD (1280x720)" }, // Already compliant
    { value: "768x1024", label: "Portrait (768x1024)" }, // Already compliant
  ];

  const qualityOptions = [
    { value: "standard", label: "Standard" },
    { value: "hd", label: "HD" },
    { value: "ultra", label: "Ultra" },
  ];

  const imageCountOptions = [
    { value: "1", label: "1 Image" },
    { value: "2", label: "2 Images" },
    { value: "4", label: "4 Images" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Settings
      </h3>
      <div className="space-y-4">
        <div>
          <Select
            label="Model"
            options={modelOptions}
            value={model}
            onChange={(value) => updateSetting("model", value)}
          />
          <Select
            label="Size"
            options={sizeOptions}
            value={size}
            onChange={(value) => updateSetting("size", value)}
          />
          <Select
            label="Quality"
            options={qualityOptions}
            value={quality}
            onChange={(value) => updateSetting("quality", value)}
          />
          {/* <Select
              label="Style"
              options={styleOptions}
              value={style}
              onChange={(value) => updateSetting("style", value)}
            /> */}
          <Select
            label="Number of Images"
            options={imageCountOptions}
            value={numberOfImages.toString()}
            onChange={(value) => setNumberOfImages(parseInt(value))}
          />
        </div>
      </div>
    </div>
  );
};
