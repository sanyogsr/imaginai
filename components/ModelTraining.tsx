// "use client";
// import React, { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import type { TrainingInput, TrainingState } from "../types";
// import { uploadZipToStorage } from "../utils/uploadToStorage";

// export const ModelTraining = () => {
//   const router = useRouter();
//   const [state, setState] = useState<TrainingState>({
//     isLoading: false,
//     error: null,
//     trainingId: null,
//     status: "idle",
//     uploadProgress: 0,
//   });

//   const [input, setInput] = useState<TrainingInput>({
//     modelName: "",
//     zipFile: null,
//   });

//   const handleFileUpload = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (!file || !file.name.endsWith(".zip")) {
//         setState((prev) => ({
//           ...prev,
//           error: "Please upload a ZIP file",
//         }));
//         return;
//       }

//       setInput((prev) => ({
//         ...prev,
//         zipFile: file,
//       }));
//     },
//     []
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!input.zipFile) {
//       setState((prev) => ({
//         ...prev,
//         error: "Please upload a ZIP file",
//       }));
//       return;
//     }

//     try {
//       setState((prev) => ({ ...prev, isLoading: true, error: null }));

//       // First upload the ZIP file to storage
//       const zipUrl = await uploadZipToStorage(input.zipFile, (progress) => {
//         setState((prev) => ({ ...prev, uploadProgress: progress }));
//       });
//       // Then start the training
//       const response = await fetch("/api/model/train-model", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           modelName: input.modelName,
//           zipUrl,
//         }),
//       });

//       const data = await response.json();
//     } finally {
//       setState((prev) => ({ ...prev, isLoading: false }));
//     }
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto p-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="modelName" className="block text-sm font-medium">
//             Model Name
//           </label>
//           <input
//             id="modelName"
//             type="text"
//             required
//             value={input.modelName}
//             onChange={(e) =>
//               setInput((prev) => ({ ...prev, modelName: e.target.value }))
//             }
//             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
//           />
//         </div>

//         <div>
//           <label htmlFor="zipFile" className="block text-sm font-medium">
//             Training Images (ZIP file)
//           </label>
//           <input
//             id="zipFile"
//             type="file"
//             accept=".zip"
//             onChange={handleFileUpload}
//             className="mt-1 block w-full"
//           />
//           {state.uploadProgress > 0 && state.uploadProgress < 100 && (
//             <div className="mt-2">
//               <div className="h-2 bg-gray-200 rounded-full">
//                 <div
//                   className="h-full bg-blue-600 rounded-full"
//                   style={{ width: `${state.uploadProgress}%` }}
//                 />
//               </div>
//               <p className="text-sm text-gray-600 mt-1">
//                 Uploading: {Math.round(state.uploadProgress)}%
//               </p>
//             </div>
//           )}
//         </div>

//         {state.error && (
//           <div className="text-red-600 text-sm">{state.error}</div>
//         )}

//         <button
//           type="submit"
//           disabled={state.isLoading || !input.modelName || !input.zipFile}
//           className="w-full px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-400"
//         >
//           {state.isLoading ? "Training..." : "Start Training"}
//         </button>
//       </form>
//     </div>
//   );
// };
"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { uploadZipToStorage } from "@/utils/uploadToStorage";

interface TrainingInput {
  modelName: string;
  zipFile: File | null;
  images: File[];
}

interface TrainingState {
  isLoading: boolean;
  error: string | null;
  trainingId: string | null;
  status: "idle" | "uploading" | "processing";
  uploadProgress: number;
}

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
    images: [],
  });

  const createZipFromImages = async (images: File[]) => {
    const zip = new JSZip();
    images.forEach((image, index) => {
      zip.file(`image_${index + 1}${getFileExtension(image.name)}`, image);
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    // Convert Blob to File
    return new File([zipBlob], "training_images.zip", {
      type: "application/zip",
    });
  };

  const getFileExtension = (filename: string) => {
    return filename.substring(filename.lastIndexOf("."));
  };

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (e.target.accept === ".zip") {
        const zipFile = files[0];
        if (!zipFile?.name.endsWith(".zip")) {
          setState((prev) => ({ ...prev, error: "Please upload a ZIP file" }));
          return;
        }
        setInput((prev) => ({ ...prev, zipFile, images: [] }));
      } else {
        if (files.length < 20) {
          setState((prev) => ({
            ...prev,
            error: "Please select at least 20 images",
          }));
          return;
        }
        setInput((prev) => ({ ...prev, images: files, zipFile: null }));
      }
      setState((prev) => ({ ...prev, error: null }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      let zipFileToUpload = input.zipFile;

      if (!zipFileToUpload && input.images.length >= 20) {
        setState((prev) => ({ ...prev, status: "processing" }));
        zipFileToUpload = await createZipFromImages(input.images);
      }

      if (!zipFileToUpload) {
        throw new Error("No valid zip file or images provided");
      }

      const zipUrl = await uploadZipToStorage(zipFileToUpload, (progress) => {
        setState((prev) => ({ ...prev, uploadProgress: progress }));
      });

      const response = await fetch("/api/model/train-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: input.modelName,
          zipUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      router.push(`/training/${data.trainingId}`);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false, status: "idle" }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-black">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="modelName"
            className="block text-sm font-medium text-gray-700"
          >
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose Upload Method
            </label>
            <div className="mt-2 space-y-4">
              <div>
                <label
                  htmlFor="zipFile"
                  className="block text-sm text-gray-600"
                >
                  Option 1: Upload ZIP file
                </label>
                <input
                  id="zipFile"
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm text-gray-600">
                  Option 2: Upload 20+ Images
                </label>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {(state.uploadProgress > 0 || state.status === "processing") && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${state.uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {state.status === "processing"
                ? "Processing images..."
                : `Uploading: ${Math.round(state.uploadProgress)}%`}
            </p>
          </div>
        )}

        {state.error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={
            state.isLoading ||
            !input.modelName ||
            (!input.zipFile && input.images.length < 20)
          }
          className="w-full px-4 py-2 rounded-md bg-blue-600 text-white 
            disabled:bg-gray-400 disabled:cursor-not-allowed
            hover:bg-blue-700 transition-colors duration-200"
        >
          {state.isLoading
            ? state.status === "processing"
              ? "Processing..."
              : "Uploading..."
            : "Start Training"}
        </button>
      </form>
    </div>
  );
};
