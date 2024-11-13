"use client";
import { useState } from "react";
import { toast } from "sonner";

export const useImageDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: number]: boolean;
  }>({});

  const handleDownload = async (imageUrl: string, imageId: number) => {
    if (!imageUrl) {
      toast.error("Invalid image URL");
      return;
    }

    setDownloadProgress((prev) => ({ ...prev, [imageId]: true }));

    try {
      // First try to fetch through your API endpoint
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();

      // Verify the blob has content
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please try again.");
    } finally {
      setDownloadProgress((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  return { handleDownload, downloadProgress };
};
