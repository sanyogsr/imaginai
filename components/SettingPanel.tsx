
import React from "react";
import { Settings as SettingsIcon } from "lucide-react"; // Renaming to avoid conflict
import { Select } from "./Select";

interface SettingsType {
    model: string;
    size: string;
    quality: string;
    style: string;
  }
interface SettingsPanelProps {
  settings: {
    model: string;
    size: string;
    quality: string;
    style: string;
  };
  onSettingChange: (key: keyof SettingsType, value: string) => void; // Updated type
  creditsLeft: number;
  daysUntilRenewal: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingChange,
  creditsLeft,
  daysUntilRenewal,
}) => {
  const modelOptions = [
    { value: "dall-e-3", label: "DALL·E 3" },
    { value: "dall-e-2", label: "DALL·E 2" },
    { value: "stable-diffusion", label: "Stable Diffusion" },
  ];

  const sizeOptions = [
    { value: "1024x1024", label: "1024 x 1024" },
    { value: "512x512", label: "512 x 512" },
    { value: "256x256", label: "256 x 256" },
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

  return (
    <div className="bg-white rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        <SettingsIcon size={20} className="text-gray-500" />
      </div>

      <div className="space-y-6 flex-1">
        <Select
          label="Model"
          options={modelOptions}
          value={settings.model}
          onChange={(value: string) => onSettingChange("model", value)}
        />

        <Select
          label="Size"
          options={sizeOptions}
          value={settings.size}
          onChange={(value: string) => onSettingChange("size", value)}
        />

        <Select
          label="Quality"
          options={qualityOptions}
          value={settings.quality}
          onChange={(value: string) => onSettingChange("quality", value)}
        />

        <Select
          label="Style"
          options={styleOptions}
          value={settings.style}
          onChange={(value: string) => onSettingChange("style", value)}
        />
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-sm font-medium text-purple-800">Credits Left</div>
          <div className="text-2xl font-bold text-purple-900">{creditsLeft}</div>
          <div className="text-xs text-purple-700">
            Renews in {daysUntilRenewal} days
          </div>
        </div>
      </div>
    </div>
  );
};
