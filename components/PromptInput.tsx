// components/dashboard/PromptInput.tsx
import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to generate..."
        className="w-full p-4 pr-24 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 resize-none h-24 transition-colors"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
        className={`absolute right-4 bottom-4 px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
          !prompt.trim() || isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
        }`}
      >
        <Sparkles size={20} className={isLoading ? "animate-spin" : ""} />
        <span>{isLoading ? "Generating..." : "Generate"}</span>
      </button>
    </div>
  );
};
