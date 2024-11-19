// // components/dashboard/PromptInput.tsx
// import React, { useState } from "react";
// import { Sparkles } from "lucide-react";

// interface PromptInputProps {
//   onSubmit: (prompt: string) => void;
//   isLoading?: boolean;
// }

// export const PromptInput: React.FC<PromptInputProps> = ({
//   onSubmit,
//   isLoading = false,
// }) => {
//   const [prompt, setPrompt] = useState("");

//   const handleSubmit = () => {
//     if (prompt.trim() && !isLoading) {
//       onSubmit(prompt.trim());
//     }
//   };

//   return (
//     <div className="relative">
//       <textarea
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Describe the image you want to generate..."
//         className="w-full p-4 pr-24 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 resize-none h-24 transition-colors"
//         disabled={isLoading}
//       />
//       <button
//         onClick={handleSubmit}
//         disabled={!prompt.trim() || isLoading}
//         className={`absolute right-4 bottom-4 px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
//           !prompt.trim() || isLoading
//             ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//             : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
//         }`}
//       >
//         <Sparkles size={20} className={isLoading ? "animate-spin" : ""} />
//         <span>{isLoading ? "Generating..." : "Generate"}</span>
//       </button>
//     </div>
//   );
// };

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Copy, Share2, Sparkles, Trash2, Save } from "lucide-react";

interface EnhancedPromptInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating?: boolean;
  className?: string;
  maxLength?: number;
  onShare?: (prompt: string) => void;
  onSave?: (prompt: string) => void;
  savedPrompts?: string[];
  recentPrompts?: string[];
}

interface SuggestionState {
  isVisible: boolean;
  suggestions: string[];
  selectedIndex: number;
}

const EnhancedPromptInput: React.FC<EnhancedPromptInputProps> = ({
  onSubmit,
  isGenerating = false,
  className = "",
  maxLength = 1000,
  onShare,
  onSave,
  savedPrompts = [],
  recentPrompts = [],
}) => {
  const [prompt, setPrompt] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionState>({
    isVisible: false,
    suggestions: [],
    selectedIndex: -1,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle text changes with character limit
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, maxLength);
    setPrompt(newValue);

    // Show suggestions when typing
    if (newValue.length > 2) {
      const filtered = [...savedPrompts, ...recentPrompts]
        .filter(
          (item) =>
            item.toLowerCase().includes(newValue.toLowerCase()) &&
            item !== newValue
        )
        .slice(0, 5);

      setSuggestions({
        isVisible: filtered.length > 0,
        suggestions: filtered,
        selectedIndex: -1,
      });
    } else {
      setSuggestions({
        isVisible: false,
        suggestions: [],
        selectedIndex: -1,
      });
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // Handle generation
  const handleGenerate = useCallback(() => {
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  }, [prompt, isGenerating, onSubmit]);

  // Copy prompt to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [prompt]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit with Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
        return;
      }

      // Navigate suggestions
      if (suggestions.isVisible) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSuggestions((prev) => ({
              ...prev,
              selectedIndex: Math.min(
                prev.selectedIndex + 1,
                prev.suggestions.length - 1
              ),
            }));
            break;
          case "ArrowUp":
            e.preventDefault();
            setSuggestions((prev) => ({
              ...prev,
              selectedIndex: Math.max(prev.selectedIndex - 1, -1),
            }));
            break;
          case "Enter":
            e.preventDefault();
            if (suggestions.selectedIndex >= 0) {
              setPrompt(suggestions.suggestions[suggestions.selectedIndex]);
              setSuggestions((prev) => ({ ...prev, isVisible: false }));
            }
            break;
          case "Escape":
            setSuggestions((prev) => ({ ...prev, isVisible: false }));
            break;
        }
      }
    },
    [suggestions, handleGenerate]
  );

  // Clear prompt
  const handleClear = useCallback(() => {
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  //   return (
  //     <div
  //       className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 ${className}`}
  //     >
  //       <div className="space-y-4">
  //         <div className="relative">
  //           <textarea
  //             ref={textareaRef}
  //             value={prompt}
  //             onChange={handlePromptChange}
  //             onKeyDown={handleKeyDown}
  //             onFocus={() => setIsFocused(true)}
  //             onBlur={() => {
  //               // Delay hiding suggestions to allow clicking them
  //               setTimeout(() => setIsFocused(false), 200);
  //             }}
  //             placeholder="Describe what you want to create..."
  //             className="w-full resize-none bg-gray-50 rounded-xl p-4 text-gray-700
  //                      placeholder-gray-400 focus:outline-none focus:ring-2
  //                      focus:ring-blue-500 border-0 min-h-[8rem]"
  //             disabled={isGenerating}
  //           />

  //           {/* Suggestions dropdown */}
  //           {suggestions.isVisible && isFocused && (
  //             <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
  //               {suggestions.suggestions.map((suggestion, index) => (
  //                 <div
  //                   key={suggestion}
  //                   className={`px-4 py-2 cursor-pointer hover:bg-gray-50
  //                            ${
  //                              index === suggestions.selectedIndex
  //                                ? "bg-gray-100"
  //                                : ""
  //                            }`}
  //                   onClick={() => {
  //                     setPrompt(suggestion);
  //                     setSuggestions((prev) => ({ ...prev, isVisible: false }));
  //                   }}
  //                 >
  //                   {suggestion}
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>

  //         <div className="flex items-center justify-between">
  //           <div className="flex gap-2">
  //             <button
  //               onClick={handleCopy}
  //               className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  //               title="Copy prompt"
  //             >
  //               <Copy className="w-5 h-5" />
  //             </button>
  //             {onShare && (
  //               <button
  //                 onClick={() => onShare(prompt)}
  //                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  //                 title="Share prompt"
  //               >
  //                 <Share2 className="w-5 h-5" />
  //               </button>
  //             )}
  //             {onSave && (
  //               <button
  //                 onClick={() => onSave(prompt)}
  //                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  //                 title="Save prompt"
  //               >
  //                 <Save className="w-5 h-5" />
  //               </button>
  //             )}

  //             <button
  //               onClick={handleClear}
  //               className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  //               title="Clear prompt"
  //             >
  //               <Trash2 className="w-5 h-5" />
  //             </button>
  //           </div>

  //           <div className="flex items-center gap-3">
  //             <span
  //               className={`text-sm ${
  //                 prompt.length >= maxLength ? "text-red-500" : "text-gray-500"
  //               }`}
  //             >
  //               {prompt.length}/{maxLength} characters
  //             </span>
  //             <button
  //               onClick={handleGenerate}
  //               disabled={isGenerating || !prompt.trim()}
  //               className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium
  //                        disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700
  //                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  //                        flex items-center gap-2"
  //             >
  //               <Sparkles
  //                 className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`}
  //               />
  //               <span>{isGenerating ? "Generating..." : "Generate"}</span>
  //             </button>
  //           </div>
  //         </div>

  //         {/* History panel */}
  //         {showHistory &&
  //           (recentPrompts.length > 0 || savedPrompts.length > 0) && (
  //             <div className="mt-4 border-t pt-4">
  //               {savedPrompts.length > 0 && (
  //                 <div className="mb-4">
  //                   <h3 className="text-sm font-medium text-gray-700 mb-2">
  //                     Saved Prompts
  //                   </h3>
  //                   <div className="space-y-2">
  //                     {savedPrompts.map((saved, index) => (
  //                       <div
  //                         key={`saved-${index}`}
  //                         className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
  //                         onClick={() => setPrompt(saved)}
  //                       >
  //                         <span className="text-sm text-gray-600 truncate">
  //                           {saved}
  //                         </span>
  //                         <button
  //                           onClick={(e) => {
  //                             e.stopPropagation();
  //                             setPrompt(saved);
  //                           }}
  //                           className="text-blue-600 text-sm hover:text-blue-700"
  //                         >
  //                           Use
  //                         </button>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}

  //               {recentPrompts.length > 0 && (
  //                 <div>
  //                   <h3 className="text-sm font-medium text-gray-700 mb-2">
  //                     Recent Prompts
  //                   </h3>
  //                   <div className="space-y-2">
  //                     {recentPrompts.map((recent, index) => (
  //                       <div
  //                         key={`recent-${index}`}
  //                         className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
  //                         onClick={() => setPrompt(recent)}
  //                       >
  //                         <span className="text-sm text-gray-600 truncate">
  //                           {recent}
  //                         </span>
  //                         <button
  //                           onClick={(e) => {
  //                             e.stopPropagation();
  //                             setPrompt(recent);
  //                           }}
  //                           className="text-blue-600 text-sm hover:text-blue-700"
  //                         >
  //                           Use
  //                         </button>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           )}
  //       </div>
  //     </div>
  //   );
  // };

  // export default EnhancedPromptInput;
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <div className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder="Describe what you want to create..."
            className="w-full resize-none bg-gray-50 rounded-xl p-4 text-gray-700 
                   placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 border-0 min-h-[8rem]"
            disabled={isGenerating}
          />

          {/* Suggestions dropdown */}
          {suggestions.isVisible && isFocused && (
            <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {suggestions.suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 
                         ${
                           index === suggestions.selectedIndex
                             ? "bg-gray-100"
                             : ""
                         }`}
                  onClick={() => {
                    setPrompt(suggestion);
                    setSuggestions((prev) => ({ ...prev, isVisible: false }));
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3">
          {/* Left Actions */}
          <div className="flex gap-2 order-2 sm:order-1">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Copy prompt"
            >
              <Copy className="w-5 h-5" />
            </button>
            {onShare && (
              <button
                onClick={() => onShare(prompt)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Share prompt"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            {onSave && (
              <button
                onClick={() => onSave(prompt)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Save prompt"
              >
                <Save className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleClear}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Clear prompt"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <span
              className={`text-sm ${
                prompt.length >= maxLength ? "text-red-500" : "text-gray-500"
              }`}
            >
              {prompt.length}/{maxLength}
            </span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 
                     text-white rounded-lg font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     hover:from-purple-700 hover:to-purple-900
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     transition-all duration-200 ease-in-out
                     flex items-center justify-center gap-2"
            >
              <Sparkles
                className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`}
              />
              <span>{isGenerating ? "Generating..." : "Generate"}</span>
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory &&
          (recentPrompts.length > 0 || savedPrompts.length > 0) && (
            <div className="mt-4 border-t pt-4">
              {savedPrompts.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Saved Prompts
                  </h3>
                  <div className="space-y-2">
                    {savedPrompts.map((saved, index) => (
                      <div
                        key={`saved-${index}`}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => setPrompt(saved)}
                      >
                        <span className="text-sm text-gray-600 truncate">
                          {saved}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrompt(saved);
                          }}
                          className="text-purple-600 text-sm hover:text-purple-700"
                        >
                          Use
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Prompts Section */}
              {recentPrompts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Recent Prompts
                  </h3>
                  <div className="space-y-2">
                    {recentPrompts.map((recent, index) => (
                      <div
                        key={`recent-${index}`}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => setPrompt(recent)}
                      >
                        <span className="text-sm text-gray-600 truncate">
                          {recent}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrompt(recent);
                          }}
                          className="text-purple-600 text-sm hover:text-purple-700"
                        >
                          Use
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default EnhancedPromptInput;
