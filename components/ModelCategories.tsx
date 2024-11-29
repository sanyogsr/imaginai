"use client";
import { useState } from "react";

export default function ModelCategories() {
  const categories = [
    { name: "Text to Image", icon: "🖼️", activeColor: "border-blue-500" },
    { name: "Text to Video", icon: "🎥", activeColor: "border-green-500" },
    { name: "Anime ID", icon: "👾", activeColor: "border-purple-500" },
    { name: "Sticker AI", icon: "🌟", activeColor: "border-pink-500" },
    { name: "3D Model Gen", icon: "🌀", activeColor: "border-cyan-500" },
    { name: "Code Helper", icon: "💻", activeColor: "border-orange-500" },
    { name: "Voice AI", icon: "🎙️", activeColor: "border-red-500" },
    { name: "Style Transfer", icon: "🎨", activeColor: "border-yellow-500" },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  return (
    <section className=" px-4 sm:px-6 lg:px-8 py-2">
      <h2 className="text-3xl font-extrabold text-black mb-8 tracking-tight">
        AI Model Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-md 
              ${
                activeCategory === category.name
                  ? `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${category.activeColor} border-2`
                  : "bg-zinc-900"
              }
              text-white text-sm cursor-pointer hover:scale-105 transform transition-transform duration-300
            `}
          >
            <span
              className={`text-3xl ${
                activeCategory === category.name ? "animate-bounce" : ""
              }`}
            >
              {category.icon}
            </span>
            <span className="whitespace-nowrap">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
