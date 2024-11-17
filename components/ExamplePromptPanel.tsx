import React, { useState } from "react";
import { Copy, CheckCheck, Sparkles, Search } from "lucide-react";

interface ExamplePrompt {
  id: string;
  text: string;
  category: "landscape" | "portrait" | "abstract" | "concept" | "character";
  likes: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface Props {
  onPromptSelect: (prompt: string) => void;
}

const examplePrompts: ExamplePrompt[] = [
  {
    id: "1",
    text: "A serene Japanese garden at sunset with cherry blossoms falling, highly detailed digital art",
    category: "landscape",
    likes: 234,
    tags: ["nature", "peaceful", "asian"],
    difficulty: "beginner",
  },
  {
    id: "2",
    text: "Cyberpunk street market in neon-lit rain, volumetric lighting, ultra realistic",
    category: "landscape",
    likes: 189,
    tags: ["scifi", "night", "urban"],
    difficulty: "intermediate",
  },
  {
    id: "3",
    text: "Portrait of an ethereal forest spirit with glowing eyes, surrounded by fireflies, mystical atmosphere",
    category: "portrait",
    tags: ["fantasy", "magical", "character"],
    likes: 156,
    difficulty: "advanced",
  },
  {
    id: "4",
    text: "Abstract fluid art in pastel colors, flowing like silk in zero gravity",
    category: "abstract",
    likes: 142,
    tags: ["minimal", "colorful", "smooth"],
    difficulty: "intermediate",
  },
  {
    id: "5",
    text: "Steampunk flying machine blueprint, technical drawing style, sepia tones",
    category: "concept",
    likes: 167,
    tags: ["technical", "vintage", "machinery"],
    difficulty: "advanced",
  },
  {
    id: "6",
    text: "Underwater city with bioluminescent architecture, deep sea atmosphere",
    category: "landscape",
    likes: 198,
    tags: ["underwater", "scifi", "architecture"],
    difficulty: "intermediate",
  },
  {
    id: "7",
    text: "Crystal golem character design, geometric forms, magical glow, fantasy art",
    category: "character",
    likes: 145,
    tags: ["fantasy", "creature", "magical"],
    difficulty: "advanced",
  },
  {
    id: "8",
    text: "Minimalist desert landscape at night with two moons, vector art style",
    category: "landscape",
    likes: 132,
    tags: ["minimal", "space", "night"],
    difficulty: "beginner",
  },
  {
    id: "9",
    text: "Fractal butterfly made of stained glass and light, symmetrical composition",
    category: "abstract",
    likes: 178,
    tags: ["fractal", "colorful", "symmetry"],
    difficulty: "intermediate",
  },
  {
    id: "10",
    text: "Ancient tree of life with glowing runes, mystical forest background",
    category: "concept",
    likes: 223,
    tags: ["fantasy", "nature", "magical"],
    difficulty: "intermediate",
  },
];

const ExamplePromptsPanel: React.FC<Props> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  // const [activeFilter, setActiveFilter] = useState<
  //   "difficulty" | "likes" | null
  // >(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const categories = [
    "all",
    "landscape",
    "portrait",
    "abstract",
    "concept",
    "character",
  ];

  const filteredPrompts = examplePrompts.filter((prompt) => {
    const categoryMatch =
      selectedCategory === "all" || prompt.category === selectedCategory;
    const searchMatch =
      prompt.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return categoryMatch && searchMatch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-black  px-4 py-7 mt-6 lg:mt-0">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Example Prompts
          </h3>
          <div className="flex gap-2"></div>
        </div>

        {/* Search and Categories */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search prompts or tags..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border rounded-lg p-3 hover:border-purple-200 transition-all cursor-pointer"
              onClick={() =>
                setExpandedPrompt(
                  expandedPrompt === prompt.id ? null : prompt.id
                )
              }
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      expandedPrompt === prompt.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {prompt.text}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(prompt.id, prompt.text);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                  >
                    {copiedId === prompt.id ? (
                      <CheckCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                    prompt.difficulty
                  )}`}
                >
                  {prompt.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplePromptsPanel;
