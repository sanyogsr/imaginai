import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Wand2, Zap, Clipboard, Dice3 } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  generateImage: () => void;
  loading: boolean;
  maxCharacters?: number;
}

export function PromptInput({
  prompt,
  setPrompt,
  generateImage,
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
    "Create a picture concept on an old man...",
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
    setCharCount(prompt.length);
    setWordCount(prompt.split(/\s+/).filter((word) => word).length);

    const timer = setTimeout(() => {
      if (prompt.trim()) {
        setAutosaveTimestamp(new Date());
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [prompt]);

  useEffect(() => {
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
      generateImage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setPrompt("");
    }
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
      className="w-full space-y-6 p-6 bg-gray-50 rounded-2xl shadow-lg border border-gray-200 transition-all"
    >
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setMood("neutral")}
            className={`p-3 rounded-full shadow-sm ${
              mood === "neutral" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            <Zap size={18} />
          </button>
          <button
            type="button"
            onClick={() => setMood("creative")}
            className={`p-3 rounded-full shadow-sm ${
              mood === "creative" ? "bg-purple-500 text-white" : "bg-white"
            }`}
          >
            <Sparkles size={18} />
          </button>
          <button
            type="button"
            onClick={() => setMood("professional")}
            className={`p-3 rounded-full shadow-sm ${
              mood === "professional" ? "bg-green-500 text-white" : "bg-white"
            }`}
          >
            <Wand2 size={18} />
          </button>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={copyToClipboard}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <Clipboard size={18} />
          </button>
          <button
            type="button"
            onClick={insertRandomPrompt}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <Dice3 size={18} />
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
          className="w-full p-4 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-400"
          disabled={loading}
          aria-invalid={!!error}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !prompt.trim() || charCount > maxCharacters}
        className={`w-full py-3 rounded-lg font-medium text-white ${
          loading || !prompt.trim() || charCount > maxCharacters
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        }`}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </form>
  );
}
