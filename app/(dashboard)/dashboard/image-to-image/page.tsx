// "use client";

// import React, { useState } from "react";

// interface FormState {
//   imagesDataUrl: string;
//   steps: number;
//   triggerWord: string;
//   isStyle: boolean;
// }

// export default function TrainPage() {
//   const [formState, setFormState] = useState<FormState>({
//     imagesDataUrl: "",
//     steps: 1000,
//     triggerWord: "",
//     isStyle: false,
//   });
//   const [status, setStatus] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormState((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("/api/train", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formState),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setStatus(`Training started! Request ID: ${data.requestId}`);
//       } else {
//         setStatus(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       setStatus("An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex justify-center items-center h-screen bg-neutral-50 px-4">
//       <div className="max-w-7xl w-full space-y-8">
//         <header className="text-center">
//           <h1 className="text-4xl font-extrabold text-neutral-100">
//             Train Your LoRA Model
//           </h1>
//           <p className="text-neutral-400 mt-2">
//             Upload your dataset and configure fine-tuning parameters. Start
//             building something extraordinary.
//           </p>
//         </header>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 space-y-6 mx-auto max-w-3xl"
//         >
//           {/* Input: Images Data URL */}
//           <div>
//             <label className="block text-neutral-100 text-sm font-medium">
//               Images Data URL
//             </label>
//             <input
//               type="text"
//               name="imagesDataUrl"
//               value={formState.imagesDataUrl}
//               onChange={handleInputChange}
//               required
//               placeholder="https://example.com/your-dataset.zip"
//               className="w-full mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
//             />
//           </div>

//           {/* Input: Steps */}
//           <div>
//             <label className="block text-neutral-100 text-sm font-medium">
//               Training Steps
//             </label>
//             <input
//               type="number"
//               name="steps"
//               value={formState.steps}
//               onChange={handleInputChange}
//               min={100}
//               max={5000}
//               required
//               placeholder="Number of training steps (e.g., 1000)"
//               className="w-full mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
//             />
//           </div>

//           {/* Input: Trigger Word */}
//           <div>
//             <label className="block text-neutral-100 text-sm font-medium">
//               Trigger Word
//             </label>
//             <input
//               type="text"
//               name="triggerWord"
//               value={formState.triggerWord}
//               onChange={handleInputChange}
//               placeholder="Optional trigger word (e.g., futuristic)"
//               className="w-full mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
//             />
//           </div>

//           {/* Checkbox: Train for Style */}
//           <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               name="isStyle"
//               checked={formState.isStyle}
//               onChange={handleInputChange}
//               id="isStyle"
//               className="h-5 w-5 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-neutral-500"
//             />
//             <label
//               htmlFor="isStyle"
//               className="text-neutral-100 text-sm font-medium"
//             >
//               Train for Style
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg font-semibold transition ${
//               loading
//                 ? "bg-neutral-700 text-neutral-500"
//                 : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
//             }`}
//           >
//             {loading ? "Training..." : "Start Training"}
//           </button>
//         </form>

//         {status && (
//           <div
//             className={`mx-auto max-w-3xl p-4 rounded-lg text-center ${
//               status.startsWith("Error")
//                 ? "bg-red-900 text-red-200"
//                 : "bg-green-900 text-green-200"
//             }`}
//           >
//             {status}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
"use client";

import React, { useState } from "react";
import JSZip from "jszip"; // A library to create zip files

interface FormState {
  images: File[];
  steps: number;
  triggerWord: string;
  isStyle: boolean;
}

export default function TrainPage() {
  const [formState, setFormState] = useState<FormState>({
    images: [],
    steps: 1000,
    triggerWord: "",
    isStyle: false,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (files) {
      setFormState((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a zip from selected images
      const zip = new JSZip();
      formState.images.forEach((file) => {
        zip.file(file.name, file);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFile = new File([zipBlob], "dataset.zip");

      // Upload zip to AWS S3
      const formData = new FormData();
      formData.append("file", zipFile);

      const uploadResponse = await fetch("/api/train-flux-lora/uploadImage", {
        method: "POST",
        body: formData,
      });
      const { zipUrl } = await uploadResponse.json();

      // Now trigger the training with the zip URL
      const response = await fetch("/api/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagesDataUrl: zipUrl,
          steps: formState.steps,
          triggerWord: formState.triggerWord,
          isStyle: formState.isStyle,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Training started! Request ID: ${data.requestId}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setStatus("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-neutral-900 px-4">
      <div className="max-w-7xl w-full space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-neutral-100">
            Train Your LoRA Model
          </h1>
          <p className="text-neutral-400 mt-2">
            Upload your dataset (20-25 images) and configure fine-tuning
            parameters.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 space-y-6 mx-auto max-w-3xl"
        >
          {/* Input: Image Upload */}
          <div>
            <label className="block text-neutral-100 text-sm font-medium">
              Upload Your Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>

          {/* Other Inputs (Steps, Trigger Word, Style) */}
          <div>
            <label className="block text-neutral-100 text-sm font-medium">
              Training Steps
            </label>
            <input
              type="number"
              name="steps"
              value={formState.steps}
              onChange={handleInputChange}
              min={100}
              max={5000}
              required
              placeholder="Number of training steps (e.g., 1000)"
              className="w-full mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>

          <div>
            <label className="block text-neutral-100 text-sm font-medium">
              Trigger Word
            </label>
            <input
              type="text"
              name="triggerWord"
              value={formState.triggerWord}
              onChange={handleInputChange}
              placeholder="Optional trigger word (e.g., futuristic)"
              className="w-full mt-2 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isStyle"
              checked={formState.isStyle}
              onChange={handleInputChange}
              id="isStyle"
              className="h-5 w-5 rounded bg-neutral-900 border border-neutral-700 focus:ring-2 focus:ring-neutral-500"
            />
            <label
              htmlFor="isStyle"
              className="text-neutral-100 text-sm font-medium"
            >
              Train for Style
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-neutral-700 text-neutral-500"
                : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
            }`}
          >
            {loading ? "Training..." : "Start Training"}
          </button>
        </form>

        {status && (
          <div
            className={`mx-auto max-w-3xl p-4 rounded-lg text-center ${
              status.startsWith("Error")
                ? "bg-red-900 text-red-200"
                : "bg-green-900 text-green-200"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </main>
  );
}
