import React from "react";
import { Select } from "./Select";
import { useSettingsStore } from "@/store/useSettingsStore";

// interface SettingsPanelProps {
//   creditsLeft: number;
//   daysUntilRenewal: number;
// }

// export const SettingsPanel: React.FC<SettingsPanelProps> = () => {
//   const { credits, fetchCredits } = userCreditsStore();
//   const session = useSession();

//   useEffect(() => {
//     if (session.data?.user) fetchCredits();
//   }, [fetchCredits]);

//   const {
//     model,
//     size,
//     quality,
//     style,
//     numberOfImages,
//     updateSetting,
//     setNumberOfImages,
//   } = useSettingsStore();

//   const modelOptions = [
//     { value: "black-forest-labs/FLUX.1-schnell", label: "Flux schnell" },
//     { value: "black-forest-labs/FLUX.1-dev", label: "Flux dev" },
//     { value: "black-forest-labs/FLUX.1.1-pro", label: "Flux ultra Pro" },
//   ];

//   const sizeOptions = [
//     { value: "896x1600", label: "Instagram Story (900x1600)" }, // Adjusted from 900x1600
//     { value: "1088x1088", label: "Instagram (1080x1080)" }, // Adjusted from 1080x1080
//     { value: "1200x624", label: "Facebook (1200x628)" }, // Adjusted from 1200x628
//     { value: "1024x1024", label: "Square (1024x1024)" }, // Already compliant
//     { value: "1600x896", label: "YouTube thumbnail (1600x900)" }, // Adjusted from 1600x900
//     { value: "1280x720", label: "HD (1280x720)" }, // Already compliant
//     { value: "768x1024", label: "Portrait (768x1024)" }, // Already compliant
//   ];

//   const qualityOptions = [
//     { value: "standard", label: "Standard" },
//     { value: "hd", label: "HD" },
//     { value: "ultra", label: "Ultra" },
//   ];

//   const styleOptions = [
//     { value: "natural", label: "Natural" },
//     { value: "vivid", label: "Vivid" },
//     { value: "artistic", label: "Artistic" },
//   ];

//   const imageCountOptions = [
//     { value: "1", label: "1 Image" },
//     { value: "2", label: "2 Images" },
//     { value: "4", label: "4 Images" },
//   ];

//   return (
//     <div className="bg-white rounded-2xl p-4 h-full flex flex-col">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
//         <SettingsIcon size={20} className="text-gray-500" />
//       </div>

//       <div className="space-y-6 flex-1">
//         <Select
//           label="Model"
//           options={modelOptions}
//           value={model}
//           onChange={(value) => updateSetting("model", value)}
//         />
//         <Select
//           label="Size"
//           options={sizeOptions}
//           value={size}
//           onChange={(value) => updateSetting("size", value)}
//         />
//         <Select
//           label="Quality"
//           options={qualityOptions}
//           value={quality}
//           onChange={(value) => updateSetting("quality", value)}
//         />
//         <Select
//           label="Style"
//           options={styleOptions}
//           value={style}
//           onChange={(value) => updateSetting("style", value)}
//         />
//         <Select
//           label="Number of Images"
//           options={imageCountOptions}
//           value={numberOfImages.toString()}
//           onChange={(value) => setNumberOfImages(parseInt(value))}
//         />
//       </div>

//       <div className="pt-4 border-t mt-4">
//         <div className="bg-purple-50 rounded-xl p-4">
//           <div className="text-sm font-medium text-purple-800">
//             Credits Left
//           </div>
//           <div className="text-2xl font-bold text-purple-900">{credits}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

export const SettingsPanel =
  // :
  // React.FC<SettingsPanelProps>
  () => {
    const {
      model,
      size,
      quality,
      numberOfImages,
      updateSetting,
      setNumberOfImages,
    } = useSettingsStore();

    const modelOptions = [
      { value: "black-forest-labs/FLUX.1-schnell", label: "Flux schnell" },
      // { value: "black-forest-labs/FLUX.1-dev", label: "Flux dev" },
      // { value: "black-forest-labs/FLUX.1.1-pro", label: "Flux ultra Pro" },
    ];

    const sizeOptions = [
      { value: "896x1600", label: "Instagram Story (900x1600)" }, // Adjusted from 900x1600
      { value: "1088x1088", label: "Instagram (1080x1080)" }, // Adjusted from 1080x1080
      { value: "1200x624", label: "Facebook (1200x628)" }, // Adjusted from 1200x628
      { value: "1024x1024", label: "Square (1024x1024)" }, // Already compliant
      { value: "1600x896", label: "YouTube thumbnail (1600x900)" }, // Adjusted from 1600x900
      { value: "1280x720", label: "HD (1280x720)" }, // Already compliant
      { value: "768x1024", label: "Portrait (768x1024)" }, // Already compliant
    ];

    const qualityOptions = [
      { value: "standard", label: "Standard" },
      { value: "hd", label: "HD" },
      { value: "ultra", label: "Ultra" },
    ];

   

    const imageCountOptions = [
      { value: "1", label: "1 Image" },
      { value: "2", label: "2 Images" },
      { value: "4", label: "4 Images" },
    ];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Settings
        </h3>
        <div className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Natural", "Artistic", "Abstract"].map((style) => (
                <button
                  key={style}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {style}
                </button>
              ))}
            </div>
          </div> */}
          <div>
            <Select
              label="Model"
              options={modelOptions}
              value={model}
              onChange={(value) => updateSetting("model", value)}
            />
            <Select
              label="Size"
              options={sizeOptions}
              value={size}
              onChange={(value) => updateSetting("size", value)}
            />
            <Select
              label="Quality"
              options={qualityOptions}
              value={quality}
              onChange={(value) => updateSetting("quality", value)}
            />
            {/* <Select
              label="Style"
              options={styleOptions}
              value={style}
              onChange={(value) => updateSetting("style", value)}
            /> */}
            <Select
              label="Number of Images"
              options={imageCountOptions}
              value={numberOfImages.toString()}
              onChange={(value) => setNumberOfImages(parseInt(value))}
            />
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <select className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
            <option>1024 x 1024</option>
            <option>512 x 512</option>
            <option>768 x 768</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality
          </label>
          <select className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
            <option>Standard</option>
            <option>HD</option>
            <option>Ultra HD</option>
          </select> */}
          </div>
        </div>
      </div>
    );
  };
