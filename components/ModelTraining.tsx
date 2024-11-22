"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { TrainingInput, TrainingState } from "../types";
import { uploadZipToStorage } from "../utils/uploadToStorage";

export const ModelTraining = () => {
  const router = useRouter();
  const [state, setState] = useState<TrainingState>({
    isLoading: false,
    error: null,
    trainingId: null,
    status: "idle",
    uploadProgress: 0,
  });

  const [input, setInput] = useState<TrainingInput>({
    modelName: "",
    zipFile: null,
  });

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.name.endsWith(".zip")) {
        setState((prev) => ({
          ...prev,
          error: "Please upload a ZIP file",
        }));
        return;
      }

      setInput((prev) => ({
        ...prev,
        zipFile: file,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.zipFile) {
      setState((prev) => ({
        ...prev,
        error: "Please upload a ZIP file",
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // First upload the ZIP file to storage
      const zipUrl = await uploadZipToStorage(input.zipFile, (progress) => {
        setState((prev) => ({ ...prev, uploadProgress: progress }));
      });

      // Then start the training
      const response = await fetch("/api/model/train-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelName: input.modelName,
          zipUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setState((prev) => ({
        ...prev,
        trainingId: data.training.id,
        status: "training",
      }));

      // Store training status in localStorage for persistence
      localStorage.setItem(
        "trainingStatus",
        JSON.stringify({
          id: data.training.id,
          modelName: input.modelName,
          timestamp: new Date().toISOString(),
        })
      );

      // Redirect to generation page
      router.push(`/dashboard/generate/${data.training.id}`);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        status: "failed",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="modelName" className="block text-sm font-medium">
            Model Name
          </label>
          <input
            id="modelName"
            type="text"
            required
            value={input.modelName}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, modelName: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="zipFile" className="block text-sm font-medium">
            Training Images (ZIP file)
          </label>
          <input
            id="zipFile"
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="mt-1 block w-full"
          />
          {state.uploadProgress > 0 && state.uploadProgress < 100 && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${state.uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {Math.round(state.uploadProgress)}%
              </p>
            </div>
          )}
        </div>

        {state.error && (
          <div className="text-red-600 text-sm">{state.error}</div>
        )}

        <button
          type="submit"
          disabled={state.isLoading || !input.modelName || !input.zipFile}
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-400"
        >
          {state.isLoading ? "Training..." : "Start Training"}
        </button>
      </form>
    </div>
  );
};
