import React, { useState, useMemo } from "react";

type Category = "landscape" | "portrait" | "abstract" | "concept" | "character";
type Difficulty = "beginner" | "intermediate" | "advanced";
type Tag = "meme" | "family" | "billionaire" | "youtube" | "controversial";

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
    // Meme-related templates,
    "Design a surrealistic version of the Distracted Boyfriend meme featuring astronauts on Mars, with holograph,ic screens and floating memes in zero gravity.",
    "Reimagine the This is Fine dog meme with a post-apocalyptic backdrop, robotic dogs, and burning skyscrapers.",
    "Create a Cat Vibing meme where the cat is DJing at a futuristic neon-lit rave with laser beams.",
    "Visualize the Drake posting meme in a medieval painting style, with knights and royal gestures.",
    "Generate a 3D render of the Pepe the Frog meme as a golden statue in a cyberpunk museum.",
    "Create an oil painting of aMocking SpongeBob meme where SpongeBob is wearing a renaissance outfit.",
    "Design theWoman Yelling at Cat meme in an alien utopia, where the women are androids and the cat is a hologram.",
    "Illustrate a TikTok-inspired You Cant See Me John Cena meme featuring a glitch effect and Gen Z fashion.",
    "ReimagineBaby Yoda sipping soup as a hyper-futuristic robot sipping a bowl of liquid stardust.",
    "Create a Shrek is Love, Shrek is Life meme where Shrek is depicted as a divine god figure in a heavenly glow.",

    "Design a whimsical family portrait where everyone is dressed as their favorite superhero, surrounded by holographic comic panels.",
    "Illustrate a family celebrating Diwali in space, with firecrackers shaped like stars and an Earth view in the background.",
    "Visualize a family road trip in a flying car, soaring above a futuristic megacity during sunset.",
    "Generate a watercolor painting of a multigenerational family picnic in a magical forest with glowing trees.",
    "Design a modern family game night scene with augmented reality games projected all around the room.",
    "Illustrate a family reunion at a beachfront bonfire, with each member holding a glowing, animated memory orb.",
    "Create a festive family dinner in a floating house, with flying dishes served by AI-powered drones.",
    "Design a steampunk-style family portrait featuring mechanical pets and brass-accented clothing.",
    "Illustrate a chaotic yet heartwarming breakfast scene with kids flying on hoverboards and parents sipping coffee mid-air.",
    "Visualize a family camping trip on a distant planet with glowing alien creatures as their friendly guides.",
    // ,Tag: Billionaire
    "Illustrate a billionaire lounging on a solid gold yacht in a crystal-clear, bioluminescent sea.",
    "Design a hyper-realistic portrait of a billionaire with a floating crown made of glowing cryptocurrencies.",
    "Create a scene of a billionaire s futuristic party, with holographic waiters and an AI DJ in a glass dome.",
    "Visualize a billionaire meditating in a zen garden on a sky island, with floating bonsai trees.",
    "Generate an oil painting of a billionaire riding a robot horse through a virtual reality desert.",
    "Design an ultra-luxurious space station suite, complete with golden windows overlooking Earth.",
    "Illustrate a billionaires gala under an ocean dome, with whales and glowing fish as the backdrop.",
    "Create a minimalist billionaire workspace featuring a solid diamond desk and holographic projectors.",
    "Visualize a billionaire flying a personal jetpack through a futuristic city skyline at sunset.",
    "Design a portrait of a billionaire surrounded by robotic bodyguards in an opulent, high-tech palace.",
    // ,Tag: YouTube
    "Illustrate a YouTuber filming in a zero-gravity studio with floating equipment and glowing comment bubbles.",
    "Design a high-energy YouTube thumbnail featuring a wild desert race between custom AI robots.",
    "Create a YouTubers dream studio inside a massive VR gaming environment, with infinite backgrounds.",
    "Visualize a popular YouTuber doing a live Q&A with fans projected as holograms around them.",
    "Generate a futuristic YouTube cooking channel setup, with robotic arms prepping food mid-air.",
    "Design a whimsical YouTube unboxing video featuring a mysterious glowing treasure chest.",
    "Illustrate a YouTube vlog of a deep-sea exploration, with vibrant marine life and glowing coral reefs.",
    "Create a hyper-realistic depiction of a YouTube prank video set in a time-traveling coffee shop.",
    "Visualize a YouTube travel vlogger documenting life on a bustling alien planet.",
    "Design a gaming YouTubers avatar leading a virtual army in a neon-lit digital battlefield.",
    // Controversial prompts
    "Reimagine a courtroom scene where AI is on trial for surpassing human intelligence, illustrated in {style} style.",
    "Depict a dinner table where world leaders negotiate peace with aliens, captured in a {style} futuristic setting.",
    "Illustrate a surreal scenario of billionaires buying planets in a galactic auction house with {modifier}.",
    "Create a cartoon where AI influencers overshadow human celebrities in a chaotic red-carpet event.",
    "Visualize the concept of 'cancel culture' as a chaotic battle between digital avatars in a {style} cyberpunk arena.",
    "Design a satirical portrait of modern society addicted to social media, with people trapped inside their phones.",
    "Generate an oil painting of ancient gods debating climate change policies with {modifier}.",
    "Illustrate a billionaire's dystopian paradise where money grows on trees, but the air is toxic, rendered in {style}.",
    "Create a dramatic pencil sketch of a time traveler stuck between natural and industrialized worlds.",
    "Design a minimalist artwork of a family dinner where everyone stares into holographic screens.",
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
  for (let i = 0; i < 40; i++) {
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
