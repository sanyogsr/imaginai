/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.pexels.com",
      "picsum.photos",
      "source.unsplash.com",
      "placekitten.com",
      "placeimg.com",
      "images.unsplash.com",
      "d17d8sfx13z6g2.cloudfront.net",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
