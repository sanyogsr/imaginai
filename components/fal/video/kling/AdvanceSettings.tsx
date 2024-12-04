import React from "react";

interface AdvancedSettingsProps {
  advancedOptions: {
    duration: "5" | "10";
    aspectRatio: "16:9" | "9:16" | "1:1";
  };
  updateAdvancedOptions: (
    options: Partial<{
      duration: "5" | "10";
      aspectRatio: "16:9" | "9:16" | "1:1";
    }>
  ) => void;
}

export function AdvancedSettings({
  advancedOptions,
  updateAdvancedOptions,
}: AdvancedSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="text-md">
        5s video require 25 credits and 10s video requires 50 credits
      </div>
      <div>
        <label className="block mb-2">Video Duration</label>
        <select
          value={advancedOptions.duration}
          onChange={(e) =>
            updateAdvancedOptions({
              duration: e.target.value as "5" | "10",
            })
          }
          className="w-full p-2 border rounded-xl"
        >
          <option value="5">5 Seconds</option>
          <option value="10">10 Seconds</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Aspect Ratio</label>
        <select
          value={advancedOptions.aspectRatio}
          onChange={(e) =>
            updateAdvancedOptions({
              aspectRatio: e.target.value as "16:9" | "9:16" | "1:1",
            })
          }
          className="w-full p-2 border rounded-xl"
        >
          <option value="16:9">16:9 Widescreen</option>
          <option value="9:16">9:16 Vertical</option>
          <option value="1:1">1:1 Square</option>
        </select>
      </div>
    </div>
  );
}
