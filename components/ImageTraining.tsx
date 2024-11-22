"use client";
import React, { useState } from "react";
// import type { GenerationInput, GenerationState } from "../types";

export interface GenerationInput {
  prompt: string;
  modelUrl: string;
  numberOfImages?: number;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  images: string[];
}
export const ImageGeneration = ({ modelUrl }: { modelUrl: string }) => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    images: [],
  });

  const [input, setInput] = useState<GenerationInput>({
    prompt: "",
    modelUrl,
    numberOfImages: 1,
  });

  const generateImages = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/generate/mytrained", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setState((prev) => ({
        ...prev,
        images: data.images,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium">
            Prompt
          </label>
          <input
            id="prompt"
            type="text"
            required
            value={input.prompt}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, prompt: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="numberOfImages" className="block text-sm font-medium">
            Number of Images
          </label>
          <input
            id="numberOfImages"
            type="number"
            min="1"
            max="4"
            value={input.numberOfImages}
            onChange={(e) =>
              setInput((prev) => ({
                ...prev,
                numberOfImages: parseInt(e.target.value),
              }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {state.error && (
          <div className="text-red-600 text-sm">{state.error}</div>
        )}

        <button
          onClick={generateImages}
          disabled={state.isLoading || !input.prompt}
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-400"
        >
          {state.isLoading ? "Generating..." : "Generate Images"}
        </button>

        {state.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {state.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Generated image ${index + 1}`}
                className="w-full rounded-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
