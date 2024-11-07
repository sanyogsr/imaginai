import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Select } from "./Select";
import { useSettingsStore } from "@/store/useSettingsStore";

interface SettingsPanelProps {
  creditsLeft: number;
  daysUntilRenewal: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  creditsLeft,
  daysUntilRenewal,
}) => {
  const {
    model,
    size,
    quality,
    style,
    numberOfImages,
    updateSetting,
    setNumberOfImages,
  } = useSettingsStore();

  const modelOptions = [
    { value: "black-forest-labs/FLUX.1-schnell", label: "Flux schnell" },
    { value: "black-forest-labs/FLUX.1-schnell", label: "Flux Dev" },
    { value: "black-forest-labs/FLUX.1-schnell", label: "Flux Pro" },
  ];

  const sizeOptions = [
    { value: "1024x1024", label: "1:1" },
    { value: "1600x900", label: "16:9" },
    { value: "1280x720", label: "16:9" },
  ];

  const qualityOptions = [
    { value: "hd", label: "HD" },
    { value: "standard", label: "Standard" },
    { value: "draft", label: "Draft" },
  ];

  const styleOptions = [
    { value: "natural", label: "Natural" },
    { value: "vivid", label: "Vivid" },
    { value: "artistic", label: "Artistic" },
  ];

  const imageCountOptions = [
    { value: "1", label: "1 Image" },
    { value: "2", label: "2 Images" },
    { value: "4", label: "4 Images" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        <SettingsIcon size={20} className="text-gray-500" />
      </div>

      <div className="space-y-6 flex-1">
        <Select
          label="Number of Images"
          options={imageCountOptions}
          value={numberOfImages.toString()}
          onChange={(value) => setNumberOfImages(parseInt(value))}
        />

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

        <Select
          label="Style"
          options={styleOptions}
          value={style}
          onChange={(value) => updateSetting("style", value)}
        />
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-sm font-medium text-purple-800">
            Credits Left
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {creditsLeft}
          </div>
          <div className="text-xs text-purple-700">
            Renews in {daysUntilRenewal} days
          </div>
        </div>
      </div>
    </div>
  );
};
