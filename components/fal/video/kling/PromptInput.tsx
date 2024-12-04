import React from "react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  generateVideo: () => void;
  loading: boolean;
}

export function PromptInput({
  prompt,
  setPrompt,
  generateVideo,
  loading,
}: PromptInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateVideo();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the video you want to generate..."
        className="w-full p-3 border rounded-xl min-h-[100px] focus:outline-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className={`
          w-full mt-2 p-3 rounded-xl text-white 
          ${
            loading || !prompt.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>
    </form>
  );
}
