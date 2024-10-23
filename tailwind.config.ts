import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      blur: {
        sm: "0.375em",
      },
      transitionTimingFunction: {
        "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      backgroundImage: {
        "conic-gradient":
          "conic-gradient(from 180deg at 50% 50%, #22ffff, #3c64ff, #c03afc, #ff54e8, #ff5959)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          500: "#3B82F6", // Adjust to your aesthetic blue
        },
      },
      maxWidth: {
        "9xl": "96rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Use a modern font
      },
    },
  },
  plugins: [],
};
export default config;
