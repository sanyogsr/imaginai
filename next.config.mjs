// Import terser-webpack-plugin as an ES module
import TerserPlugin from "terser-webpack-plugin";

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
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Removes console statements in production
            },
          },
        })
      );
    }
    return config;
  },
};

// Use `export default` instead of `module.exports` for ES module syntax
export default nextConfig;
