"use client";
import React from "react";
import { ModelType } from "@/types/models";

const colors = {
  primary: "#FF4C94", // Vibrant pink
  accent: "#7000FF", // Electric purple
  success: "#00FFB3", // Mint green
  warning: "#FFE847", // Electric yellow
  error: "#FF3D3D", // Bright red
  neutral: "#232323", // Almost black
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "starting":
        return "bg-[#FFE847] text-black";
      case "processing":
        return "bg-[#7000FF] text-white";
      case "canceled":
        return "bg-[#232323] text-white";
      case "failed":
        return "bg-[#FF3D3D] text-white";
      case "succeeded":
        return "bg-[#00FFB3] text-black";
      default:
        return "bg-[#232323] text-white";
    }
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyles()}`}
    >
      {status || "No Status"}
    </span>
  );
};

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-3 border-[#FF4C94] border-t-transparent" />
);

const ProgressBar = () => (
  <div className="h-1.5 w-full bg-[#F4F4F4] rounded-full overflow-hidden">
    <div
      className="h-full bg-[#FF4C94] rounded-full"
      style={{
        animation: "progress 2s ease-in-out infinite",
      }}
    />
  </div>
);

const ModelCard = ({ model }: { model: ModelType }) => {
  const isLoading =
    model.training_status === "starting" ||
    model.training_status === "processing";

  return (
    <div className="group bg-white rounded-3xl border-2 border-[#F4F4F4] hover:border-[#FF4C94] transition-all duration-300">
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-start gap-3">
          <h2 className="font-black text-xl text-[#232323]">
            {model.model_name || "Unnamed Model"}
          </h2>
          <StatusBadge status={model.training_status} />
        </div>

        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-sm font-bold text-[#FF4C94]">
                {model.training_status === "starting"
                  ? "✨ Getting ready"
                  : "🚀 Processing"}
              </span>
            </div>
            <ProgressBar />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[#232323] font-bold text-sm">Trigger:</span>
            <span className="bg-[#F4F4F4] px-3 py-1.5 rounded-full text-sm font-bold text-[#232323]">
              {model.trigger_word || "None"}
            </span>
          </div>

          <p className="text-sm text-[#666666] font-medium">
            {new Date(model.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 px-5 py-2.5 bg-[#232323]  text-white text-sm font-bold rounded-lg transition-colors"
            onClick={() => console.log("Generate images")}
          >
            Generate images
          </button>

          {model.zipUrl && (
            <a
              href={model.zipUrl}
              className="flex-1 px-5 py-2.5 bg-[#232323] hover:bg-[#FF4C94] text-white text-sm font-bold rounded-full transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              💾 Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ModelList: React.FC<{ models: ModelType[] }> = ({ models }) => {
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-2xl font-black text-[#232323]">
          No models found yet ✨
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
};

export default ModelList;

// Add to your global CSS
const styles = `
@keyframes progress {
  0% { width: 0%; }
  50% { width: 90%; }
  100% { width: 0%; }
}
`;
