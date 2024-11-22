"use client";
import { useRouter } from "next/navigation";
// import {  useState } from "react";
// import { ImageGeneration } from "@/components/ImageTraining";

export default function GeneratePage() {
  const router = useRouter();
  // const { id } = router;
  // const [modelUrl, setModelUrl] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // if (!id) return;

  //   const checkTrainingStatus = async () => {
  //     try {
  //       const response = await fetch(`/api/training-status?id=${id}`);
  //       const data = await response.json();

  //       if (
  //         data.training.status === "succeeded" &&
  //         data.training.output?.model
  //       ) {
  //         setModelUrl(data.training.output.model);
  //         setIsLoading(false);
  //       } else if (data.training.status === "failed") {
  //         setError("Training failed");
  //         setIsLoading(false);
  //       } else {
  //         // Still training, check again in 10 seconds
  //         setTimeout(checkTrainingStatus, 10000);
  //       }
  //     } catch (error) {
  //       setError("Failed to check training status");
  //       setIsLoading(false);
  //     }
  //   };

  //   checkTrainingStatus();
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //         <p className="mt-4">Training in progress...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          {/* <p>{error}</p> */}
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Start New Training
          </button>
        </div>
      </div>
    );
  // }

  // if (!modelUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Waiting for model URL...</p>
        </div>
      </div>
    );
  // }

  // return <ImageGeneration modelUrl={modelUrl} />;
}
