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
