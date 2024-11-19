import React, { useState, useMemo } from "react";

type Category = "landscape" | "portrait" | "abstract" | "concept" | "character";
type Difficulty = "beginner" | "intermediate" | "advanced";
type Tag = "meme" | "family" | "billionaire" | "youtube";

interface ExamplePrompt {
  id: string;
  text: string;
  category: Category;
  likes: number;
  tags: Tag[];
  difficulty: Difficulty;
}

interface Props {
  onPromptSelect: (prompt: string) => void;
}

// Helper function to generate a large number of prompts
const generatePrompts = (): ExamplePrompt[] => {
  const prompts: ExamplePrompt[] = [];
  const categories: Category[] = [
    "landscape",
    "portrait",
    "abstract",
    "concept",
    "character",
  ];
  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];
  const tags: Tag[] = ["meme", "family", "billionaire", "youtube"];

  // Template prompts that will be varied
  const templates = [
    // Meme-related templates
    "Create a {style} version of the {subject} meme with {modifier}",
    "Reimagine the {subject} meme in a {style} style with {modifier}",
    "Design a {style} meme featuring {subject} with {modifier}",

    // Family-related templates
    "Capture a {style} family portrait with {subject} and {modifier}",
    "Design a {style} family gathering scene with {subject} and {modifier}",
    "Create a {style} family moment showing {subject} with {modifier}",

    // Billionaire-related templates
    "Generate a {style} portrait of a billionaire {subject} with {modifier}",
    "Create a {style} scene of luxury featuring {subject} with {modifier}",
    "Design a {style} wealth visualization with {subject} and {modifier}",

    // YouTube-related templates
    "Design a {style} YouTube thumbnail featuring {subject} with {modifier}",
    "Create a {style} streaming setup with {subject} and {modifier}",
    "Generate a {style} content creator scene with {subject} and {modifier}",
  ];

  const styles = [
    "minimalist",
    "hyper-realistic",
    "cartoon",
    "vintage",
    "futuristic",
    "watercolor",
    "oil painting",
    "digital art",
    "pencil sketch",
    "3D rendered",
  ];

  const subjects = [
    "successful entrepreneur",
    "tech innovator",
    "social media influencer",
    "family celebration",
    "holiday gathering",
    "weekend adventure",
    "viral moment",
    "trending topic",
    "popular challenge",
    "luxury lifestyle",
    "modern workspace",
    "creative studio",
  ];

  const modifiers = [
    "dramatic lighting",
    "vibrant colors",
    "muted tones",
    "cinematic composition",
    "dynamic poses",
    "natural expressions",
    "urban background",
    "nature setting",
    "studio environment",
    "emotional impact",
    "storytelling elements",
    "authentic feel",
  ];

  // Generate 400+ unique prompts
  for (let i = 0; i < 405; i++) {
    const template = templates[i % templates.length];
    const style = styles[i % styles.length];
    const subject = subjects[i % subjects.length];
    const modifier = modifiers[i % modifiers.length];

    const prompt = template
      .replace("{style}", style)
      .replace("{subject}", subject)
      .replace("{modifier}", modifier);

    prompts.push({
      id: `prompt-${i + 1}`,
      text: prompt,
      category: categories[i % categories.length],
      likes: Math.floor(Math.random() * 500) + 100,
      tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
      difficulty: difficulties[i % difficulties.length],
    });
  }

  return prompts;
};

const examplePrompts = generatePrompts();

const ExamplePromptsPanel: React.FC<Props> = ({ onPromptSelect }) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>(
    "all"
  );
  const [selectedTag, setSelectedTag] = useState<"all" | Tag>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"likes" | "difficulty">("likes");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // const categories: ("all" | Category)[] = [
  //   "all",
  //   "landscape",
  //   "portrait",
  //   "abstract",
  //   "concept",
  //   "character",
  // ];
  const tags: ("all" | Tag)[] = [
    "all",
    "meme",
    "family",
    "billionaire",
    "youtube",
  ];

  const filteredAndSortedPrompts = useMemo(() => {
    const filtered = examplePrompts.filter((prompt) => {
      const categoryMatch =
        selectedCategory === "all" || prompt.category === selectedCategory;
      const tagMatch =
        selectedTag === "all" || prompt.tags.includes(selectedTag);
      const searchMatch = prompt.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return categoryMatch && tagMatch && searchMatch;
    });

    if (sortBy === "likes") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      filtered.sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      );
    }

    return filtered;
  }, [selectedCategory, selectedTag, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedPrompts.length / itemsPerPage);
  const paginatedPrompts = filteredAndSortedPrompts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onPromptSelect(text);
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[difficulty];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6">
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Example Prompts</h3>

          {/* Search */}
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Tags*/}

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTag === tag
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {tag === "all" ? "All Tags" : `#${tag}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setSortBy("difficulty")}
                className={`px-3 py-1 rounded-lg text-sm ${
                  sortBy === "difficulty"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                Sort by Difficulty
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {filteredAndSortedPrompts.length} prompts found
            </span>
          </div>
        </div>

        {/* Prompts List */}
        <div className="space-y-4">
          {paginatedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border rounded-lg p-4 hover:border-blue-200 transition-all cursor-pointer"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(prompt.id, prompt.text);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  {copiedId === prompt.id ? "✓" : "Copy"}
                </button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplePromptsPanel;
