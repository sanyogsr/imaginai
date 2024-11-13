// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import { HistoryPanel } from "@/components/History";
// import { ImagePreview } from "@/components/ImagePreview";
// import { PromptInput } from "@/components/PromptInput";
// import { SettingsPanel } from "@/components/SettingPanel";
// import { Progress } from "@/components/ProgressBar";
// import { useHistoryStore } from "@/store/useHistoryStore";
// import { cn } from "@/utils/cn";
// import { AnimatedContainer } from "@/components/AnimatedContainer";
// import { useSettingsStore } from "@/store/useSettingsStore";
// import { useImageStore } from "@/store/useImageStore";
// import { useSession } from "next-auth/react";
// import { redirect, useRouter } from "next/navigation";
// import axios from "axios";
// import { userCreditsStore } from "@/store/useCreditStore";
// import { toast } from "sonner"; // Import Sonner toast for notifications

// interface HistoryItem {
//   id: number;
//   imageUrls: string[];
//   prompt: string;
//   timestamp: string;
//   model: string;
//   size: string;
//   quality: string;
//   style: string;
// }

// interface GenerationPhase {
//   phase: number;
//   message: string;
// }

// export default function Dashboard() {
//   const { addToHistory, clearHistory, fetchHistory } = useHistoryStore();
//   const { model, size, quality, style, numberOfImages } = useSettingsStore();
//   const { addGeneratedImages, clearGeneratedImages, fetchUserImages } =
//     useImageStore();
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const { credits, deductCredits } = userCreditsStore();

//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
//   const [currentPhase, setCurrentPhase] = useState<GenerationPhase>({
//     phase: 0,
//     message: "Ready",
//   });

//   useEffect(() => {
//     if (session?.user?.id) {
//       clearGeneratedImages();
//       clearHistory();
//       fetchUserImages(session.user.id);
//       fetchHistory(session.user.id);
//     }
//   }, [session?.user?.id]);

//   const simulateProgress = useCallback(() => {
//     const phases = [
//       { message: "Analyzing prompt..." },
//       { message: "Generating initial concepts..." },
//       { message: "Refining details..." },
//       { message: "Finalizing image..." },
//     ];

//     setProgress(0);
//     let currentPhase = 0;
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         const newProgress = Math.min(prev + 2, 100);
//         const phaseIndex = Math.floor((newProgress / 100) * phases.length);

//         if (phaseIndex !== currentPhase && phaseIndex < phases.length) {
//           currentPhase = phaseIndex;
//           setCurrentPhase({
//             phase: phaseIndex,
//             message: phases[phaseIndex].message,
//           });
//         }

//         if (newProgress >= 100) {
//           clearInterval(interval);
//         }
//         return newProgress;
//       });
//     }, 50);

//     return () => clearInterval(interval);
//   }, []);

//   const handlePromptSubmit = async (prompt: string) => {
//     const cleanedPrompt = prompt
//       .trim()
//       .normalize("NFC")
//       .replace(/[^\w\s.,!?'":;\-()]/gi, "")
//       .slice(0, 150);

//     if (!cleanedPrompt) return;

//     if (credits === null || credits <= 0) {
//       toast("Please upgrade your plan to get more credits.");
//       router.push("/dashboard/upgrade");
//       return;
//     }

//     setIsGenerating(true);
//     clearGeneratedImages();
//     const stopProgress = simulateProgress();

//     try {
//       const [width, height] = size.split("x").map(Number);

//       console.log("Sending prompt to generate-image:", cleanedPrompt);
//       const response = await axios.post("/api/generate-image", {
//         prompt: cleanedPrompt,
//         model,
//         width,
//         height,
//         quality,
//         style,
//         steps: 4,
//         n: numberOfImages,
//       });

//       if (response.status !== 200 || !response.data) {
//         throw new Error("Image generation failed");
//       }

//       const data1 = response.data;
//       await deductCredits(numberOfImages);

//       let generatedImages: string[] = [];
//       if (data1.response && data1.response.data) {
//         generatedImages = data1.response.data.map(
//           (imageData: { b64_json: string }) =>
//             `data:image/png;base64,${imageData.b64_json}`
//         );
//         addGeneratedImages(generatedImages);
//       } else {
//         console.warn("No images received from generate-image API");
//       }

//       const userId = session?.user?.id;
//       if (userId && generatedImages.length > 0) {
//         console.log("Uploading images to S3...");
//         await axios.post("/api/image/upload-image", {
//           images: generatedImages,
//           userId,
//           prompt: cleanedPrompt,
//           model,
//           creditsUsed: numberOfImages * 2,
//         });

//         const historyItem: HistoryItem = {
//           id: Date.now(),
//           imageUrls: generatedImages,
//           prompt: cleanedPrompt,
//           timestamp: new Date().toLocaleString(),
//           model,
//           size,
//           quality,
//           style,
//         };
//         addToHistory(historyItem);
//       } else {
//         toast("Failed to upload images. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during generation or upload:", error);
//       toast("Something went wrong. Please try again later.");
//     } finally {
//       stopProgress();
//       setTimeout(() => {
//         setIsGenerating(false);
//         setCurrentPhase({ phase: 0, message: "Ready" });
//       }, 500);
//     }
//   };

//   if (status === "loading")
//     return (
//       <p className="text-black mt-20 flex items-center justify-center h-screen">
//         Loading...
//       </p>
//     );

//   if (!session) {
//     redirect("/");
//     return null;
//   }

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-white lg:overflow-hidden overflow-auto">
//       <div className="container mx-auto h-[calc(100vh-4rem)] mt-[3.5rem]">
//         <div className="grid grid-cols-12 gap-6 p-6 h-full">
//           <HistorySection />
//           <MainContent
//             isGenerating={isGenerating}
//             progress={progress}
//             currentPhase={currentPhase}
//             handlePromptSubmit={handlePromptSubmit}
//           />
//           <SettingsSection />
//         </div>
//       </div>
//     </div>
//   );
// }
// function HistorySection() {
//   const [selectedImage, setSelectedImage] = useState<string | undefined>();

//   return (
//     <div className="hidden lg:block lg:col-span-2 h-full">
//       <div className="sticky top-6">
//         <AnimatedContainer variant="glass" className="h-[calc(100vh-6rem)]">
//           <HistoryPanel onImageSelect={setSelectedImage} />
//         </AnimatedContainer>
//       </div>
//     </div>
//   );
// }

// function MainContent({
//   isGenerating,
//   progress,
//   currentPhase,
//   handlePromptSubmit,
// }: {
//   isGenerating: boolean;
//   progress: number;
//   currentPhase: GenerationPhase;
//   handlePromptSubmit: (prompt: string) => void;
// }) {
//   return (
//     <div className="col-span-12 lg:col-span-8 h-full">
//       <div className="p-8 h-full flex flex-col gap-6">
//         <GenerationProgress
//           isGenerating={isGenerating}
//           progress={progress}
//           currentPhase={currentPhase}
//         />
//         <ImagePreview
//           className={cn(
//             "flex-1 rounded-xl overflow-hidden bg-gray-50",
//             "transition-all duration-500 transform",
//             isGenerating ? "scale-95 blur-sm" : "scale-100"
//           )}
//         />
//         <PromptInput onSubmit={handlePromptSubmit} isLoading={isGenerating} />
//       </div>
//     </div>
//   );
// }

// function GenerationProgress({
//   isGenerating,
//   progress,
//   currentPhase,
// }: {
//   isGenerating: boolean;
//   progress: number;
//   currentPhase: GenerationPhase;
// }) {
//   return (
//     <div
//       className={cn(
//         "space-y-4 transition-all duration-500",
//         isGenerating ? "opacity-100" : "opacity-0 h-0"
//       )}
//     >
//       <Progress value={progress} variant="gradient" size="md" showValue />
//       <div className="flex justify-between text-sm">
//         <span className="text-teal-500 font-medium">
//           {currentPhase.message}
//         </span>
//         <span className="text-blue-500 font-medium">{progress}% Complete</span>
//       </div>
//     </div>
//   );
// }

// function SettingsSection() {
//   return (
//     <div className="col-span-12 lg:col-span-2 h-full">
//       <div className="sticky top-6">
//         <AnimatedContainer variant="glass" className="h-[calc(100vh-6rem)]">
//           <SettingsPanel creditsLeft={100} daysUntilRenewal={30} />
//         </AnimatedContainer>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { HistoryPanel } from "@/components/History";
import { ImagePreview } from "@/components/ImagePreview";
import { PromptInput } from "@/components/PromptInput";
import { SettingsPanel } from "@/components/SettingPanel";
import { Progress } from "@/components/ProgressBar";
import { useHistoryStore } from "@/store/useHistoryStore";
import { cn } from "@/utils/cn";
import { AnimatedContainer } from "@/components/AnimatedContainer";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useImageStore } from "@/store/useImageStore";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { userCreditsStore } from "@/store/useCreditStore";
import { toast } from "sonner"; // Import Sonner toast for notifications

interface HistoryItem {
  id: number;
  imageUrls: string[];
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

interface GenerationPhase {
  phase: number;
  message: string;
}

export default function Dashboard() {
  const { addToHistory, clearHistory, fetchHistory } = useHistoryStore();
  const { model, size, quality, style, numberOfImages } = useSettingsStore();
  const { addGeneratedImages, clearGeneratedImages, fetchUserImages } =
    useImageStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { credits, deductCredits } = userCreditsStore();

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<GenerationPhase>({
    phase: 0,
    message: "Ready",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImage, setSelectedImage] = useState<string | undefined>(); // Preserve selectedImage

  useEffect(() => {
    if (session?.user?.id) {
      clearGeneratedImages();
      clearHistory();
      fetchUserImages(session.user.id);
      fetchHistory(session.user.id);
    }
  }, [session?.user?.id]);

  const simulateProgress = useCallback(() => {
    const phases = [
      { message: "Analyzing prompt..." },
      { message: "Generating initial concepts..." },
      { message: "Refining details..." },
      { message: "Finalizing image..." },
    ];

    setProgress(0);
    let currentPhase = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 2, 100);
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);

        if (phaseIndex !== currentPhase && phaseIndex < phases.length) {
          currentPhase = phaseIndex;
          setCurrentPhase({
            phase: phaseIndex,
            message: phases[phaseIndex].message,
          });
        }

        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handlePromptSubmit = async (prompt: string) => {
    const cleanedPrompt = prompt
      .trim()
      .normalize("NFC")
      .replace(/[^\w\s.,!?'":;\-()]/gi, "")
      .slice(0, 150);

    if (!cleanedPrompt) return;

    if (credits === null || credits <= 0) {
      toast.error("Please upgrade your plan to get more credits.");
      router.push("/dashboard/upgrade");
      return;
    }

    setIsGenerating(true);
    clearGeneratedImages();
    const stopProgress = simulateProgress();

    try {
      const [width, height] = size.split("x").map(Number);

      console.log("Sending prompt to generate-image:", cleanedPrompt);
      const response = await axios.post("/api/generate-image", {
        prompt: cleanedPrompt,
        model,
        width,
        height,
        quality,
        style,
        steps: 4,
        n: numberOfImages,
      });

      if (response.status !== 200 || !response.data) {
        throw new Error("Image generation failed");
      }

      const data1 = response.data;
      await deductCredits(numberOfImages);

      let generatedImages: string[] = [];
      if (data1.response && data1.response.data) {
        generatedImages = data1.response.data.map(
          (imageData: { b64_json: string }) =>
            `data:image/png;base64,${imageData.b64_json}`
        );
        addGeneratedImages(generatedImages);
      } else {
        console.warn("No images received from generate-image API");
      }

      const userId = session?.user?.id;
      if (userId && generatedImages.length > 0) {
        console.log("Uploading images to S3...");
        await axios.post("/api/image/upload-image", {
          images: generatedImages,
          userId,
          prompt: cleanedPrompt,
          model,
          creditsUsed: numberOfImages * 2,
        });

        const historyItem: HistoryItem = {
          id: Date.now(),
          imageUrls: generatedImages,
          prompt: cleanedPrompt,
          timestamp: new Date().toLocaleString(),
          model,
          size,
          quality,
          style,
        };
        addToHistory(historyItem);
      } else {
        toast.warning("Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Error during generation or upload:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      stopProgress();
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentPhase({ phase: 0, message: "Ready" });
      }, 500);
    }
  };

  if (status === "loading")
    return (
      <p className="text-black mt-20 flex items-center justify-center h-screen">
        Loading...
      </p>
    );

  if (!session) {
    redirect("/");
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white lg:overflow-hidden overflow-auto">
      <div className="container mx-auto h-[calc(100vh-4rem)] mt-[3.5rem]">
        <div className="grid grid-cols-12 gap-6 p-6 h-full">
          <HistorySection setSelectedImage={setSelectedImage} />
          <MainContent
            isGenerating={isGenerating}
            progress={progress}
            currentPhase={currentPhase}
            handlePromptSubmit={handlePromptSubmit}
          />
          <SettingsSection />
        </div>
      </div>
    </div>
  );
}

function HistorySection({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <div className="hidden lg:block lg:col-span-2 h-full">
      <div className="sticky top-6">
        <AnimatedContainer variant="glass" className="h-[calc(100vh-6rem)]">
          <HistoryPanel onImageSelect={setSelectedImage} />
        </AnimatedContainer>
      </div>
    </div>
  );
}

function MainContent({
  isGenerating,
  progress,
  currentPhase,
  handlePromptSubmit,
}: {
  isGenerating: boolean;
  progress: number;
  currentPhase: GenerationPhase;
  handlePromptSubmit: (prompt: string) => void;
}) {
  return (
    <div className="col-span-12 lg:col-span-8 h-full">
      <div className="p-8 h-full flex flex-col gap-6">
        <GenerationProgress
          isGenerating={isGenerating}
          progress={progress}
          currentPhase={currentPhase}
        />
        <ImagePreview
          className={cn(
            "flex-1 rounded-xl overflow-hidden bg-gray-50",
            "transition-all duration-500 transform",
            isGenerating ? "scale-95 blur-sm" : "scale-100"
          )}
        />
        <PromptInput onSubmit={handlePromptSubmit} isLoading={isGenerating} />
      </div>
    </div>
  );
}

function GenerationProgress({
  isGenerating,
  progress,
  currentPhase,
}: {
  isGenerating: boolean;
  progress: number;
  currentPhase: GenerationPhase;
}) {
  return (
    <div
      className={cn(
        "space-y-4 transition-all duration-500",
        isGenerating ? "opacity-100" : "opacity-0 h-0"
      )}
    >
      <Progress value={progress} variant="gradient" size="md" showValue />
      <div className="flex justify-between text-sm">
        <span className="text-teal-500 font-medium">
          {currentPhase.message}
        </span>
        <span className="text-blue-500 font-medium">{progress}% Complete</span>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="col-span-12 lg:col-span-2 h-full">
      <div className="sticky top-6">
        <AnimatedContainer variant="glass" className="h-[calc(100vh-6rem)]">
          <SettingsPanel creditsLeft={100} daysUntilRenewal={30} />
        </AnimatedContainer>
      </div>
    </div>
  );
}
