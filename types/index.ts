export interface Settings {
  model: string;
  size: string;
  quality: string;
  style: string;
}

export interface HistoryItem {
  id: number;
  imageUrls: string[];
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
}

export interface SettingsPanelProps {
  settings: Settings;
  onSettingChange: (key: keyof Settings, value: string) => void;
  creditsLeft: number;
  daysUntilRenewal: number;
}

export interface ImagePreviewProps {
  onFullscreen?: () => void;
  className?: string;
}
export interface TrainingInput {
  modelName: string;
  zipFile: File | null;
}

export interface TrainingResponse {
  id: string;
  status: string;
  modelUrl?: string;
  error?: string;
}

export interface TrainingState {
  isLoading: boolean;
  error: string | null;
  trainingId: string | null;
  status: "idle" | "training" | "completed" | "failed";
  uploadProgress: number;
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  image: string;
  timestamp: Date;
  style: string;
  seed: number;
  aspectRatio: string;
  complexity: number;
}

export interface AIModelConfig {
  id: string;
  name: string;
  maxResolution: number;
  supportedStyles: string[];
  speed: number;
  supportedAspectRatios?: string[];
}

export interface AdvancedOptions {
  style: string;
  aspectRatio: string;
  negativePrompt: string;
  samplingSteps: number;
  cfgScale: number;
  seed?: number | null;
  enhancementLevel: string;
  numImages: number;
}
// export interface VideoGeneration {
//   id: string;
//   prompt: string;
//   image_url: string;
//   video_url?: string;
//   timestamp: Date;
//   style?: string;
//   seed?: number | null;
// }

// export interface VideoModelConfig {
//   id: string;
//   name: string;
//   maxDuration: number;
//   supportedStyles: string[];
//   speed: number;
// }

// export interface VideoAdvancedOptions {
//   style: string;
//   prompt_optimizer: boolean;
//   seed?: number | null;
// }
export type VideoGenerationStatus =
  | "IN_QUEUE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export interface VideoModelConfig {
  id: string;
  name: string;
  maxDuration: number;
  supportedStyles: string[];
  speed: number;
}

export interface VideoAdvancedOptions {
  style: string;
  prompt_optimizer: boolean;
  seed: number | null;
}

export interface VideoGeneration {
  id: string;
  prompt: string;
  image_url: string;
  video_url: string;
  timestamp: Date;
  style: string;
  seed: number | null;
}

export interface FalVideoResult {
  video: {
    url: string;
  };
}

export interface VideoPreviewProps {
  currentVideo: VideoGeneration | null;
  advancedOptions?: VideoAdvancedOptions; // Optional prop
}

export interface VideoAdvancedSettingsProps {
  advancedOptions: VideoAdvancedOptions;
  videoModels: VideoModelConfig[];
  updateAdvancedOptions: (options: Partial<VideoAdvancedOptions>) => void;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

export interface VideoPreviewProps {
  currentVideo: VideoGeneration | null;
}
