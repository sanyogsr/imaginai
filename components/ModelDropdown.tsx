// components/ModelDropdown.tsx
import { useState } from "react";

interface ModelDropdownProps {
  models: string[];
  onSelect: (model: string) => void;
}

const ModelDropdown: React.FC<ModelDropdownProps> = ({ models, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (model: string) => {
    setSelectedModel(model);
    onSelect(model);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-[5rem] md:w-[8rem] ">
      <button
        className="bg-gray-200 px-4 py-1 rounded-md w-full text-left flex justify-between items-center"
        onClick={toggleDropdown}
      >
        {selectedModel}
        <span
          className={`ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 bg-white border rounded-md shadow-lg w-full mt-2 max-h-48 overflow-y-auto">
          {models.map((model) => (
            <li
              key={model}
              onClick={() => handleSelect(model)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {model}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModelDropdown;
