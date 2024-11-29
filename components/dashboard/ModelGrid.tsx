"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../DashboardFooter";

interface Model {
  name: string;
  category: string;
  description: string;
  tier: "Basic" | "Pro" | "Pro";
  preview: string; // Path to the preview image
  href: string; // Link to the model's page
}

interface Category {
  name: string;
  icon: string;
  activeColor: string;
}

export default function ModelGrid() {
  const categories: Category[] = [
    { name: "Text to Image", icon: "🖼️", activeColor: "border-blue-500" },
    { name: "Text to Video", icon: "🎥", activeColor: "border-green-500" },
    { name: "Anime ID", icon: "👾", activeColor: "border-purple-500" },
    { name: "Sticker AI", icon: "🌟", activeColor: "border-pink-500" },
    { name: "3D Model Gen", icon: "🌀", activeColor: "border-cyan-500" },
    { name: "Voice AI", icon: "🎙️", activeColor: "border-red-500" },
  ];

  const modelOptions = [
    { value: "black-forest-labs/FLUX.1-schnell", label: "Flux schnell" },
    { value: "black-forest-labs/FLUX.1-dev", label: "Flux dev" },
    { value: "black-forest-labs/FLUX.1.1-pro", label: "Flux 1.1 Pro" },
  ];
  const models: Model[] = [
    {
      name: "FLux/Schnell",
      category: "Text to Image",
      description: "High-quality text-to-image generation.",
      tier: "Basic",
      preview:
        "https://replicate.delivery/yhqm/pNZ3A6l9B35dB9VxE0eGqkGfBGe401MjUttdOyzvpfWbEb6NB/out-0.webp", // Add preview image path here
      href: `/dashboard/text-to-image?model=${modelOptions[0].value}`, // Add link here
    },
    {
      name: "Flux/dev",
      category: "Text to Image",
      description: "LoRA-powered image generation.",
      tier: "Pro",
      preview:
        "https://replicate.delivery/yhqm/xU3wLlAQcGpZLVQipTVxaZMaL4omk9n7d1suU0byMnngfQvJA/out-0.webp", // Add preview image path here
      href: `/dashboard/text-to-image?model=${modelOptions[1].value}`, // Add link here
    },
    {
      name: "Flux/Pro",
      category: "Text to Image",
      description: "LoRA-powered image generation.",
      tier: "Pro",
      preview:
        "https://bflapistorage.blob.core.windows.net/public/547e601710b343da95b72a9e4038bd70/sample.jpg", // Add preview image path here
      href: `/dashboard/text-to-image?model=${modelOptions[2].value}`, // Add link here
    },
    {
      name: "Train your model  -  coming soon",
      category: "Text to Image",
      description: "image to image generation.",
      tier: "Pro",
      preview:
        "https://replicate.delivery/yhqm/GveeAfJpuDGdnJqA0grhfZeQWuedoFNTTAKvw7oF7MJkGb50E/out-0.webp", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "ReCraft V3 - coming soon",
      category: "Text to Image",
      description: "Redefine creative workflows.",
      tier: "Pro",
      preview:
        "https://replicate.delivery/czjl/76zoOfWaVAQLBKkcnQGMDNwOntaGbhLW1JL0XvwTY3T3uB2JA/output.webp", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Bytedance/SDXL Lightning - coming soon",
      category: "Text to Image",
      description: "Fast and efficient text-to-image AI.",
      tier: "Pro",
      preview:
        "https://replicate.delivery/yhqm/VyD24fDyzM2nQSg0nQc58W2EIj16hGcWKrXJozjAMR1BeidTA/out-0.png", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Stable Diffusion SDXL - soon",
      category: "Text to Image",
      description: "High-quality text-to-image generation.",
      tier: "Pro",
      preview:
        "https://pbxt.replicate.delivery/YXbcLudoHBIYHV6L0HbcTx5iRzLFMwygLr3vhGpZI35caXbE/out-0.png", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Stable Diffusion - coming soon",
      category: "Text to Image",
      description: "High-quality text-to-image generation.",
      tier: "Pro",
      preview:
        "https://replicate.delivery/pbxt/sWeZFZou6v3CPKuoJbqX46ugPaHT1DcsWYx0srPmGrMOCPYIA/out-0.png", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Hailuo AI -  Coming Soon",
      category: "Text to Video",
      description: "Advanced video generation.",
      tier: "Pro",
      preview: "", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Kling AI - Coming Soon",
      category: "Text to Video",
      description: "Next-gen video transformation.",
      tier: "Pro",
      preview: "", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Chroma Anime -  Coming Soon",
      category: "Anime ID",
      description: "Identify anime characters instantly.",
      tier: "Basic",
      preview: "", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "Sticker Genius -  Coming Soon",
      category: "Sticker AI",
      description: "Generate fun stickers in seconds.",
      tier: "Pro",
      preview: "", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "3D Vision Pro -  Coming Soon",
      category: "3D Model Gen",
      description: "Generate complex 3D models.",
      tier: "Pro",
      preview: "", // Add preview image path here
      href: "", // Add link here
    },
    {
      name: "VocalSynth -  Coming Soon",
      category: "Voice AI",
      description: "Create realistic voice transformations.",
      tier: "Pro",
      preview: "", // Add preview image path here
      href: "", // Add link here
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-2">
      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-black mb-6">
          AI Model Categories
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm cursor-pointer 
                ${
                  activeCategory === category.name
                    ? `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${category.activeColor} border-2`
                    : "bg-zinc-900"
                } text-white hover:scale-105 transform transition-transform duration-300`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="whitespace-nowrap">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-black mb-6">
          {activeCategory} Models
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models
            .filter((model) => model.category === activeCategory)
            .map((model) => (
              <Link key={model.name} href={model.href}>
                <div className="bg-zinc-800 rounded-lg shadow-lg p-4 space-y-4 hover:bg-zinc-700 transition-colors cursor-pointer">
                  <div className="relative w-full h-40">
                    <Image
                      src={model.preview || "/placeholder.png"} // Fallback placeholder image
                      alt={model.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-400">{model.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {model.category}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        model.tier === "Basic"
                          ? "bg-green-500 text-black"
                          : model.tier === "Pro"
                          ? "bg-blue-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {model.tier}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <Footer />
    </section>
  );
}
