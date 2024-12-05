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
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md sm:shadow-lg transition-all duration-300 space-y-4 sm:space-y-6">
      <p className="text-xs sm:text-sm text-gray-500 text-center leading-5">
        5s videos require{" "}
        <span className="font-semibold text-black">25 credits</span> and 10s
        videos require{" "}
        <span className="font-semibold text-black">50 credits</span>
      </p>

      <div>
        <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
          Video Duration
        </label>
        <select
          value={advancedOptions.duration}
          onChange={(e) =>
            updateAdvancedOptions({
              duration: e.target.value as "5" | "10",
            })
          }
          className="w-full p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="5">5 Seconds</option>
          <option value="10">10 Seconds</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
          Aspect Ratio
        </label>
        <select
          value={advancedOptions.aspectRatio}
          onChange={(e) =>
            updateAdvancedOptions({
              aspectRatio: e.target.value as "16:9" | "9:16" | "1:1",
            })
          }
          className="w-full p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="16:9">16:9 Widescreen</option>
          <option value="9:16">9:16 Vertical</option>
          <option value="1:1">1:1 Square</option>
        </select>
      </div>
    </div>
  );
}
