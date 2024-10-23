// "use client";
// import React, { useCallback, useState } from "react";
// import { HistoryPanel } from "@/components/History";
// import { ImagePreview } from "@/components/ImagePreview";
// import { PromptInput } from "@/components/PromptInput";
// import { SettingsPanel } from "@/components/SettingPanel";
// import { Progress } from "@/components/ProgressBar";
// import { useHistoryStore } from "@/store/useHistoryStore";

// interface Settings {
//   model: string;
//   size: string;
//   quality: string;
//   style: string;
// }

// export default function Dashboard() {
//   const { addToHistory } = useHistoryStore();

//   const [settings, setSettings] = useState<Settings>({
//     model: "dall-e-3",
//     size: "1024x1024",
//     quality: "standard",
//     style: "natural",
//   });

//   const [generatedImage, setGeneratedImage] = useState<string | undefined>();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const simulateProgress = useCallback(() => {
//     setProgress(0);
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           return 100;
//         }
//         return Math.min(prev + 2, 100);
//       });
//     }, 50);

//     return () => clearInterval(interval);
//   }, []);

//   const handlePromptSubmit = async (prompt: string) => {
//     if (!prompt.trim()) return;

//     setIsGenerating(true);
//     const stopProgress = simulateProgress();

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       const newImage = `/api/placeholder/1024/1024`;
//       setGeneratedImage(newImage);

//       const newHistoryItem = {
//         id: Date.now(),
//         imageUrl: newImage,
//         prompt,
//         timestamp: new Date().toLocaleString(),
//         model: settings.model,
//         size: settings.size,
//         quality: settings.quality,
//         style: settings.style,
//       };

//       addToHistory(newHistoryItem);
//     } catch (error) {
//       console.error("Error generating image:", error);
//     } finally {
//       stopProgress();
//       setProgress(100);
//       setTimeout(() => {
//         setIsGenerating(false);
//         setProgress(0);
//       }, 500);
//     }
//   };

//   const handleSettingChange = (key: keyof Settings, value: string) => {
//     setSettings((prev) => {
//       const newSettings = { ...prev, [key]: value };
//       if (generatedImage) {
//         setIsGenerating(true);
//         setTimeout(() => setIsGenerating(false), 300);
//       }
//       return newSettings;
//     });
//   };

//   return (
//     <div className="grid grid-cols-12 lg:h-[calc(100vh-4rem)] min-h-screen lg:mt-0  lg:pt-16 gap-4 p-4 bg-gray-50 overflow-y-auto lg:overflow-hidden">
//       {/* History Panel */}
//       <div className="col-span-12 lg:col-span-2 h-full overflow-y-auto lg:overflow-hidden">
//         <HistoryPanel />
//       </div>

//       {/* Main Content */}
//       <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 flex flex-col gap-6">
//         <div className="flex-1 min-h-0 flex flex-col">
//           {/* Progress Bar */}
//           {isGenerating && (
//             <div className="mb-4">
//               <Progress value={progress} />
//               <p className="text-sm text-gray-500 mt-2 text-center">
//                 Generating your image... {progress}%
//               </p>
//             </div>
//           )}

//           {/* Image Preview Area */}
//           <div className="flex-1 min-h-0 flex items-center justify-center bg-gray-50 rounded-xl">
//             <ImagePreview
//               imageUrl={generatedImage}
//               alt="Generated artwork"
//             />
//           </div>

//           {/* Prompt Input Area */}
//           <div className="mt-6">
//             <PromptInput
//               onSubmit={handlePromptSubmit}
//               isLoading={isGenerating}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Settings Panel */}
//       <div className="col-span-12 lg:col-span-2 h-full overflow-y-auto lg:overflow-hidden">
//         <SettingsPanel
//           settings={settings}
//           onSettingChange={handleSettingChange}
//           creditsLeft={100}
//           daysUntilRenewal={30}
//         />
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useCallback, useState } from "react";
import { HistoryPanel } from "@/components/History";
import { ImagePreview } from "@/components/ImagePreview";
import { PromptInput } from "@/components/PromptInput";
import { SettingsPanel } from "@/components/SettingPanel";
import { Progress } from "@/components/ProgressBar";
import { useHistoryStore } from "@/store/useHistoryStore";

// Renaming the interface to avoid conflict
interface SettingsType {
  model: string;
  size: string;
  quality: string;
  style: string;
}

export default function Dashboard() {
  const { addToHistory } = useHistoryStore();

  const [settings, setSettings] = useState<SettingsType>({
    model: "dall-e-3",
    size: "1024x1024",
    quality: "standard",
    style: "natural",
  });

  const [generatedImage, setGeneratedImage] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handlePromptSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const stopProgress = simulateProgress();

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const newImage = `/api/placeholder/1024/1024`;
      setGeneratedImage(newImage);

      const newHistoryItem = {
        id: Date.now(),
        imageUrl: newImage,
        prompt,
        timestamp: new Date().toLocaleString(),
        model: settings.model,
        size: settings.size,
        quality: settings.quality,
        style: settings.style,
      };

      addToHistory(newHistoryItem);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      stopProgress();
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleSettingChange = (key: keyof SettingsType, value: string) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      if (generatedImage) {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 300);
      }
      return newSettings;
    });
  };

  return (
    <div className="grid grid-cols-12 lg:h-[calc(100vh-4rem)] min-h-screen lg:mt-0  lg:pt-16 gap-4 p-4 bg-gray-50 overflow-y-auto lg:overflow-hidden">
      {/* History Panel */}
      <div className="col-span-12 lg:col-span-2 h-full overflow-y-auto lg:overflow-hidden">
        <HistoryPanel />
      </div>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Progress Bar */}
          {isGenerating && (
            <div className="mb-4">
              <Progress value={progress} />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Generating your image... {progress}%
              </p>
            </div>
          )}

          {/* Image Preview Area */}
          <div className="flex-1 min-h-0 flex items-center justify-center bg-gray-50 rounded-xl">
            <ImagePreview imageUrl={generatedImage} alt="Generated artwork" />
          </div>

          {/* Prompt Input Area */}
          <div className="mt-6">
            <PromptInput
              onSubmit={handlePromptSubmit}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="col-span-12 lg:col-span-2 h-full overflow-y-auto lg:overflow-hidden">
        <SettingsPanel
          settings={settings}
          onSettingChange={handleSettingChange}
          creditsLeft={100}
          daysUntilRenewal={30}
        />
      </div>
    </div>
  );
}
