import React from "react";
import { AIModelConfig, AdvancedOptions } from "@/types";

interface AdvancedSettingsProps {
  advancedOptions: AdvancedOptions;
  aiModels: AIModelConfig[];
  updateAdvancedOptions: (options: Partial<AdvancedOptions>) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  advancedOptions,
  aiModels,
  updateAdvancedOptions,
}) => (
  <div className="space-y-4">
    {/* Style Selection */}
    <div>
      <label className="block mb-2 text-black">Style</label>
      <select
        value={advancedOptions.style}
        onChange={(e) => updateAdvancedOptions({ style: e.target.value })}
        className="w-full text-black border border-black p-2 rounded"
      >
        {[
          "realistic_image",
          "digital_illustration",
          "vector_illustration",
          "realistic_image/b_and_w",
          "realistic_image/hard_flash",
          "realistic_image/hdr",
          "realistic_image/natural_light",
        ].map((ratio) => (
          <option key={ratio} value={ratio}>
            {ratio}
          </option>
        ))}
      </select>
    </div>

    {/* Aspect Ratio */}
    <div>
      <label className="block mb-2 text-black">Aspect Ratio</label>
      <select
        value={advancedOptions.aspectRatio}
        onChange={(e) => updateAdvancedOptions({ aspectRatio: e.target.value })}
        className="w-full  text-black border border-black p-2 rounded"
      >
        {[
          "square_hd",
          "square",
          "portrait_4_3",
          "portrait_16_9",
          "landscape_4_3",
          "landscape_16_9",
        ].map((ratio) => (
          <option key={ratio} value={ratio}>
            {ratio}
          </option>
        ))}
      </select>
    </div>

    {/* Number of Images */}
    <div>
      <label className="block mb-2 text-black">Number of Images</label>
      <input
        type="number"
        min="1"
        max="4"
        value={advancedOptions.numImages}
        onChange={(e) =>
          updateAdvancedOptions({ numImages: parseInt(e.target.value) })
        }
        className="w-full  text-black border border-black p-2 rounded"
      />
    </div>
  </div>
);
//  "realistic_image" ,"digital_illustration" , "vector_illustration" , "realistic_image/b_and_w" , "realistic_image/hard_flash" , "realistic_image/hdr" , "realistic_image/natural_light
