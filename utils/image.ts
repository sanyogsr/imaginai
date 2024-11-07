// utils/image.ts

// Function to get a random placeholder image from various services
export const getPlaceholderImage = (width: number, height: number): string => {
  const services = [
    `https://picsum.photos/${width}/${height}`,
    `https://picsum.photos/${width}/${height}`,
    `https://picsum.photos/${width}/${height}`,
    `https://picsum.photos/${width}/${height}`,
    `https://picsum.photos/${width}/${height}`,
    `https://picsum.photos/${width}/${height}`,
    // `https://source.unsplash.com/random/${width}x${height}`,
    // `https://placekitten.com/${width}/${height}`,
    // `https://placeimg.com/${width}/${height}/nature`,
  ];

  // Randomly select a service
  const randomService = services[Math.floor(Math.random() * services.length)];

  // Add cache-busting parameter to ensure unique images
  return `${randomService}?${Date.now()}`;
};

// Function to generate multiple placeholder images
export const generatePlaceholderImages = (
  count: number,
  width: number,
  height: number
): string[] => {
  return Array(count)
    .fill(null)
    .map(() => getPlaceholderImage(width, height));
};
