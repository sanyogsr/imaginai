import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Wand2,
  Zap,
  Clipboard,
  Dice3,
  FileWarning,
  MessageSquareWarning,
} from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  generateVideo: () => void;
  loading: boolean;
  maxCharacters?: number;
}

export function PromptInput({
  prompt,
  setPrompt,
  generateVideo,
  loading,
  maxCharacters = 300,
}: PromptInputProps) {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState("");
  const [autosaveTimestamp, setAutosaveTimestamp] = useState<Date | null>(null);
  const [mood, setMood] = useState<"neutral" | "creative" | "professional">(
    "neutral"
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rotatingPlaceholders = [
    "Describe a cinematic travel vlog...",
    "Tell us your dream animation idea...",
    "Create a short film concept...",
    "Imagine a tutorial on any topic...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const neutralSuggestions = [
    "A day in the life of an urban explorer",
    "Exploring hidden gems in local communities",
    "Unexpected connections in modern society",
  ];

  const creativeSuggestions = [
    "A surreal journey through a dream landscape",
    "An underwater city with bioluminescent creatures",
    "Time-lapse of a city transforming through seasons",
  ];

  const professionalSuggestions = [
    "Step-by-step software development tutorial",
    "Corporate sustainability impact documentary",
    "Technical innovation showcase",
  ];

  const getRandomSuggestion = () => {
    const suggestionMap = {
      neutral: neutralSuggestions,
      creative: creativeSuggestions,
      professional: professionalSuggestions,
    };
    const suggestions = suggestionMap[mood];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const insertRandomPrompt = () => {
    const randomSuggestion = getRandomSuggestion();
    const newPrompt = prompt
      ? prompt + " " + randomSuggestion
      : randomSuggestion;
    setPrompt(newPrompt);
  };
  useEffect(() => {
    // Update character and word counts
    setCharCount(prompt.length);
    setWordCount(prompt.split(/\s+/).filter((word) => word).length);

    // Autosave logic
    const timer = setTimeout(() => {
      if (prompt.trim()) {
        setAutosaveTimestamp(new Date());
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [prompt]);

  useEffect(() => {
    // Cycle through placeholder text
    const placeholderTimer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3000);

    return () => clearInterval(placeholderTimer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Prompt cannot be empty!");
    } else if (charCount > maxCharacters) {
      setError(`Prompt exceeds the maximum of ${maxCharacters} characters.`);
    } else {
      setError("");
      generateVideo();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setPrompt("");
    }
    // Add enhanced keyboard shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "k":
          e.preventDefault();
          setMood((prev) =>
            prev === "neutral"
              ? "creative"
              : prev === "creative"
              ? "professional"
              : "neutral"
          );
          break;
      }
    }
  };

  const clearInput = () => setPrompt("");

  const copyToClipboard = () => {
    if (textareaRef.current) {
      navigator.clipboard.writeText(prompt);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 p-4 bg-white rounded-xl shadow-md transition-all"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setMood("neutral")}
            className={`p-2 rounded-full ${
              mood === "neutral" ? "bg-blue-100 text-blue-600" : "text-gray-500"
            }`}
            title="Neutral Mode"
          >
            <Zap size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMood("creative")}
            className={`p-2 rounded-full ${
              mood === "creative"
                ? "bg-purple-100 text-purple-600"
                : "text-gray-500"
            }`}
            title="Creative Mode"
          >
            <Sparkles size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMood("professional")}
            className={`p-2 rounded-full ${
              mood === "professional"
                ? "bg-green-100 text-green-600"
                : "text-gray-500"
            }`}
            title="Professional Mode"
          >
            <Wand2 size={16} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-gray-500 hover:text-blue-500 transition-colors"
            title="Copy Prompt"
          >
            <Clipboard size={16} />
          </button>
          <button
            type="button"
            onClick={insertRandomPrompt}
            className="text-gray-500 hover:text-blue-500 transition-colors"
            title="Insert Random Prompt"
          >
            <Dice3 size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (e.target.value.length > maxCharacters) {
              setError(`Maximum of ${maxCharacters} characters allowed.`);
            } else {
              setError("");
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={rotatingPlaceholders[placeholderIndex]}
          className={`w-full p-3 border rounded-xl min-h-[120px] focus:outline-blue-500 resize-none transition-all
          ${loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          ${error ? "border-red-500" : "border-gray-300"}`}
          disabled={loading}
          aria-invalid={!!error}
          aria-describedby="input-error"
        />
      </div>

      {error && (
        <div id="input-error" className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          {charCount}/{maxCharacters} characters | {wordCount} words
        </span>
        <button
          type="button"
          onClick={clearInput}
          className="text-blue-500 hover:text-blue-700 focus:outline-none"
          title="Clear input"
        >
          Clear
        </button>
      </div>

      {autosaveTimestamp && (
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <div> Last saved at {autosaveTimestamp.toLocaleTimeString()}</div>{" "}
          <span className="text-red-600 flex items-center gap-2">
            <MessageSquareWarning size={13} /> please do not refresh or press
            back/home button{" "}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !prompt.trim() || charCount > maxCharacters}
        className={`w-full flex justify-center items-center mt-2 p-3 rounded-xl text-white font-medium
        ${
          loading || !prompt.trim() || charCount > maxCharacters
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
        } transition-all`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            <span>Generating...</span>
          </div>
        ) : (
          "Generate Video"
        )}
      </button>
    </form>
  );
}
