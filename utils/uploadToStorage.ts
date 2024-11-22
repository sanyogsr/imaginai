export async function uploadZipToStorage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/image/upload-image/zip", {
    method: "POST",
    body: formData,
    // onUploadProgress: (progressEvent) => {
    //   if (progressEvent.total) {
    //     const progress = (progressEvent.loaded / progressEvent.total) * 100;
    //     onProgress?.(progress);
    //   }
    // },
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const data = await response.json();
  return data.url;
}
