export default async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to get canvas context");
  }

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.translate(crop.width / 2, crop.height / 2);
  ctx.rotate(radians);

  if (flip.horizontal) ctx.scale(-1, 1);
  if (flip.vertical) ctx.scale(1, -1);

  ctx.drawImage(
    image,
    crop.x - newWidth / 2,
    crop.y - newHeight / 2,
    newWidth,
    newHeight
  );

  return canvas.toDataURL("image/jpeg"); // Export cropped image as Base64
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = "anonymous"; // To avoid CORS issues
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });
}
