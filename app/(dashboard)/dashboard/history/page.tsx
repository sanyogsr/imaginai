"use client";
import { FullScreenViewer } from "@/components/history/FullScreenViewer";
import { ImageCard } from "@/components/history/ImageCard";
import { StatsCard } from "@/components/history/StatsCard";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useImageDownload } from "@/utils/useImageDownload";
import {
  Download,
  Grid,
  Heart,
  ImageIcon,
  LayoutGrid,
  Loader2,
  MessageCircle,
  Plus,
  Sparkles,
  Palette,
  Wand2,
  Trash2,
} from "lucide-react";

interface HistoryItem {
  id: number;
  imageUrls: string[];
  prompt: string;
  timestamp: string;
  model: string;
  size: string;
  quality: string;
  style: string;
  likes?: number;
  comments?: number;
}
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ImageHistoryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "masonry" | "minimal">(
    "minimal"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const { history, removeFromHistory, clearHistory, isLoading, fetchHistory } =
    useHistoryStore();
  const { handleDownload, downloadProgress } = useImageDownload();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.id) {
      fetchHistory(session.data.user.id);
    }
  }, [fetchHistory, session]);

  const handleImageClick = (image: HistoryItem, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsFullscreen(true);
  };

  const handleDeleteImage = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
      removeFromHistory(id);
      toast.success("Image deleted successfully");
    } catch (e) {
      toast.error(`Failed to delete image${e}`);
    }
  };
  // Custom Hook for Masonry Layout
  const MasonryGrid = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className={`
        grid gap-3 md:gap-4 lg:gap-5
        ${
          viewMode === "minimal"
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "columns-2 md:columns-3 lg:columns-4 xl:columns-5"
        }
      `}
      >
        {children}
      </div>
    );
  };

  // Modern Filter Bar Component
  const FilterBar = () => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 py-2"
    >
      {["all", "latest", "trending", "favorites"].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
            ${
              activeFilter === filter
                ? "bg-black text-white shadow-lg scale-105"
                : "bg-white/50 backdrop-blur-md hover:bg-white/80"
            }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </motion.div>
  );

  // Modern View Toggle Component
  const ViewToggle = () => (
    <div className="flex gap-2 bg-white/50 backdrop-blur-md p-1 rounded-full">
      {[
        { mode: "minimal", icon: <Grid className="w-4 h-4" /> },
        { mode: "grid", icon: <LayoutGrid className="w-4 h-4" /> },
        // { mode: "masonry", icon: <Palette className="w-4 h-4" /> },
      ].map(({ mode, icon }) => (
        <button
          key={mode}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => setViewMode(mode as any)}
          className={`p-2 rounded-full transition-all ${
            viewMode === mode
              ? "bg-black text-white shadow-md"
              : "hover:bg-white/50"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );

  // Featured Creation Component
  const FeaturedCreation = () => {
    const featuredImage = history[0];
    if (!featuredImage) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100"
      >
        <div className="relative aspect-[21/9] overflow-hidden">
          <img
            src={featuredImage.imageUrls[0]}
            alt="Featured creation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Featured Creation</h3>
            <p className="line-clamp-2 text-white/80">{featuredImage.prompt}</p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all">
              <Wand2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
        >
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent 
                          bg-clip-text tracking-tight mb-4"
            >
              Creative Gallery
            </h1>
            <p className="text-lg text-gray-600">
              Your AI masterpiece collection
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ViewToggle />
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear all history?"
                    )
                  ) {
                    clearHistory();
                    setSelectedImage(null);
                    toast.success("Gallery cleared successfully");
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-red-600 text-white 
                         rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Clear All</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg"
          >
            <Loader2 className="w-16 h-16 text-purple-600 mb-4 animate-spin" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Loading Your Masterpieces
            </h3>
            <p className="text-gray-500">
              Just a moment while we gather your creations...
            </p>
          </motion.div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg"
          >
            <div className="relative mb-8">
              <ImageIcon className="w-20 h-20 text-gray-300" />
              <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center animate-bounce">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Start Your Creative Journey
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Your gallery is waiting for its first masterpiece. Create
              something amazing!
            </p>
            <button
              onClick={() => (window.location.href = "/create")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full
                       font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Creating
            </button>
          </motion.div>
        ) : (
          <>
            <FeaturedCreation />
            <FilterBar />
            <MasonryGrid>
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={
                    viewMode === "masonry" ? "mb-4 break-inside-avoid" : ""
                  }
                >
                  <ImageCard
                    item={item}
                    index={index}
                    onImageClick={handleImageClick}
                    onDelete={handleDeleteImage}
                    downloadProgress={downloadProgress}
                    handleDownload={handleDownload}
                    // viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </MasonryGrid>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              <StatsCard
                title="Total Images"
                value={history.length}
                icon={<ImageIcon className="w-6 h-6 text-purple-600" />}
              />
            </motion.div>
          </>
        )}

        {/* Enhanced Full Screen Image Viewer */}
        {isFullscreen && selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg"
            onClick={() => setIsFullscreen(false)}
          >
            <div
              className="absolute inset-0 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <FullScreenViewer
                selectedImage={selectedImage}
                onClose={() => setIsFullscreen(false)}
                onNavigate={(direction) => {
                  const newIndex =
                    direction === "prev"
                      ? (currentImageIndex - 1 + history.length) %
                        history.length
                      : (currentImageIndex + 1) % history.length;
                  setCurrentImageIndex(newIndex);
                  setSelectedImage(history[newIndex]);
                }}
                onDelete={handleDeleteImage}
                downloadProgress={downloadProgress}
                handleDownload={handleDownload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageHistoryPage;
