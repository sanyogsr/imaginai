import React, { useState } from "react";
import { Listbox } from "@headlessui/react";

const SidebarOptions = () => {
  const [selectedModel, setSelectedModel] = useState("Flux Dev");
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [numberOfImages, setNumberOfImages] = useState(1);

  const models = ["Flux Dev", "Flux Schnell", "Flux Pro"];
  const styles = ["Realistic", "Abstract", "Cartoonish", "Surreal"];

  return (
    <div className="space-y-8 p-4">
      {/* Model Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase">
          Choose Model
        </h3>
        <Listbox value={selectedModel} onChange={setSelectedModel}>
          <Listbox.Button className="w-full px-4 py-2 text-left bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
            {selectedModel}
          </Listbox.Button>
          <Listbox.Options className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-white shadow-lg">
            {models.map((model) => (
              <Listbox.Option
                key={model}
                value={model}
                className="cursor-pointer px-4 py-2 hover:bg-indigo-100"
              >
                {model}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase">
          Choose Style
        </h3>
        <Listbox value={selectedStyle} onChange={setSelectedStyle}>
          <Listbox.Button className="w-full px-4 py-2 text-left bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
            {selectedStyle}
          </Listbox.Button>
          <Listbox.Options className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-white shadow-lg">
            {styles.map((style) => (
              <Listbox.Option
                key={style}
                value={style}
                className="cursor-pointer px-4 py-2 hover:bg-indigo-100"
              >
                {style}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>

      {/* Number of Images */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase">
          Number of Images
        </h3>
        <input
          type="number"
          value={numberOfImages}
          onChange={(e) => setNumberOfImages(Number(e.target.value))}
          className="w-full px-4 py-2 bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          min="1"
          max="10"
        />
      </div>
    </div>
  );
};

export default SidebarOptions;
