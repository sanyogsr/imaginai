"use client";
import FullScreenViewer from "@/components/history/FullScreenViewer";
import { ImageCard } from "@/components/history/ImageCard";
import { StatsCard } from "@/components/history/StatsCard";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useImageDownload } from "@/utils/useImageDownload";
import { ImageIcon, LayoutGrid, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const ImageHistoryPage = () => {
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"grid" | "minimal">("minimal");
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

  const handleNavigate = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentImageIndex - 1 + history.length) % history.length
        : (currentImageIndex + 1) % history.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(history[newIndex]);
  };

  const handleCloseViewer = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
  };
  const Grid = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className={`
        grid gap-4 w-full
        ${
          viewMode === "minimal"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      `}
      >
        {children}
      </div>
    );
  };

  const FilterBar = () => (
    <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar py-2">
      {["all", "latest", "trending", "favorites"].map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              activeFilter === filter
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );

  const ViewToggle = () => (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      {[{ mode: "minimal" }, { mode: "grid" }].map(({ mode }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode as "grid" | "minimal")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === mode ? "bg-black text-white" : "hover:bg-gray-200"
          }`}
        >
          {mode === "minimal" ? (
            <LayoutGrid className="w-4 h-4" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Creative Gallery
            </h1>
            <p className="text-gray-600">Your AI masterpiece collection</p>
          </div>

          <div className="flex items-center gap-3">
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
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg 
                         hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600">Loading your gallery...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Creative Journey
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Your gallery is waiting for its first masterpiece.
            </p>
            <button
              onClick={() => (window.location.href = "/text-to-image")}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 
                       transition-colors"
            >
              Start Creating
            </button>
          </div>
        ) : (
          <>
            <FilterBar />
            <Grid>
              {history.map((item, index) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  index={index}
                  onImageClick={handleImageClick}
                  onDelete={handleDeleteImage}
                  downloadProgress={downloadProgress}
                  handleDownload={handleDownload}
                />
              ))}
            </Grid>

            <div className="mt-12 mb-12">
              <StatsCard
                title="Total Images"
                value={history.length}
                icon={<ImageIcon className="w-5 h-5 text-gray-600" />}
              />
            </div>
          </>
        )}

        {/* Fullscreen Viewer */}

        {isFullscreen && selectedImage && (
          <FullScreenViewer
            selectedImage={selectedImage}
            onClose={handleCloseViewer}
            onNavigate={handleNavigate}
            onDelete={handleDeleteImage}
            downloadProgress={downloadProgress}
            handleDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};

export default ImageHistoryPage;
