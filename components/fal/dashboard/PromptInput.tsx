import React from "react";
// import { Icons } from "@/utils/Icons";
import { Sparkle } from "lucide-react";
interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  generateImage: () => void;
  loading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  generateImage,
  loading,
}) => (
  <div className="flex space-x-4">
    <input
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Describe your masterpiece..."
      className="flex-grow bg-white border border-black text-black p-4 rounded-xl focus:ring-2 focus:ring-blue-500"
    />
    <div className="flex space-x-2">
      <button
        onClick={generateImage}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition flex items-center"
      >
        <Sparkle />
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  </div>
);
