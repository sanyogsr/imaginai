import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Download,
  Search,
  X,
  Loader,
  ImagePlus,
  Check,
  Plus,
} from "lucide-react";
import { useHistoryStore } from "@/store/useHistoryStore";
import Image from "next/image";
import Link from "next/link";

interface HistoryPanelProps {
  userId?: string;
  onImageSelect?: (imageUrl: string) => void;
}

// Custom Modal Component
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center border-1 border-black justify-center mx-10">
      <div className="absolute inset-0 bg-black/50 " onClick={onClose} />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Custom Slider Component
const CustomSlider = ({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const newValue = Math.round(min + percentage * (max - min));
      onChange(newValue);
    },
    [min, max, onChange]
  );

  useEffect(() => {
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleInteraction);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleInteraction]);

  return (
    <div
      ref={sliderRef}
      className="relative w-32 h-2 bg-gray-200 rounded-full cursor-pointer"
      onClick={handleInteraction}
      onMouseDown={() => {
        document.addEventListener("mousemove", handleInteraction);
      }}
    >
      <div
        className="absolute h-full bg-blue-500 rounded-full"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -mt-1 shadow-md"
        style={{
          left: `calc(${((value - min) / (max - min)) * 100}% - 0.5rem)`,
        }}
      />
    </div>
  );
};

// Toast Component
const Toast = ({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) => {
  return (
    <div
      className={`
        fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
        animate-fadeIn
      `}
    >
      {message}
    </div>
  );
};

// Main History Panel Component
const HistoryPanel: React.FC<HistoryPanelProps> = ({
  userId = "",
  // onImageSelect,
}) => {
  const { history, isLoading, fetchHistory } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedModel, setSelectedModel] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedStyle, setSelectedStyle] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isGridView, setIsGridView] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  // const [showCalendar, setShowCalendar] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Image drag functionality
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Show toast message
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return history
      .filter((item) => {
        const matchesSearch = item.prompt
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesModel = !selectedModel || item.model === selectedModel;
        const matchesStyle = !selectedStyle || item.style === selectedStyle;
        const matchesDate =
          !dateRange.from ||
          (new Date(item.timestamp) >= dateRange.from &&
            (!dateRange.to || new Date(item.timestamp) <= dateRange.to));
        return matchesSearch && matchesModel && matchesStyle && matchesDate;
      })
      .slice(0, 6);
  }, [history, searchQuery, selectedModel, selectedStyle, dateRange]);

  // Download functionality

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("Image downloaded successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Failed to download image", "error");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!previewImage) return;

      switch (e.key) {
        case "ArrowLeft":
          setSelectedImageIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case "ArrowRight":
          setSelectedImageIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "Escape":
          setPreviewImage(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [previewImage, filteredItems.length]);

  // Fetch history on mount
  useEffect(() => {
    if (userId) fetchHistory(userId);
  }, [userId, fetchHistory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between gap-4">
          {" "}
          <h2 className="text-xl font-semibold">History</h2>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="p-2 rounded-lg hover:bg-gray-100"
            title={isGridView ? "Switch to list view" : "Switch to grid view"}
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          <Link href={"/dashboard/history"} className="text-blue-400">
            View all images...
          </Link>
        </div>

        {selectedItems.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                Array.from(selectedItems).forEach((id) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const item = history.find((h) => h.id === (id as any));
                  if (item) handleDownload(item.imageUrls[0]);
                });
              }}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Download Selected ({selectedItems.size})
            </button>
            <button
              onClick={() => setSelectedItems(new Set())}
              className="p-1.5 text-gray-500 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      {/* Grid/List View */}
      <div
        className={`
        ${
          isGridView
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }
      `}
      >
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={`
              group relative
              ${
                isGridView
                  ? "aspect-square rounded-lg overflow-hidden"
                  : "flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              }
            `}
          >
            {/* Image */}
            <div
              className={`
                relative cursor-pointer
                ${isGridView ? "w-full h-full" : "w-24 h-24"}
              `}
              onClick={() => {
                setPreviewImage(item.imageUrls[0]);
                setSelectedImageIndex(index);
              }}
            >
              <Image
                src={item.imageUrls[0]}
                alt={item.prompt}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Info */}
            <div
              className={`
              ${
                isGridView
                  ? "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-white"
                  : "flex-1"
              }
            `}
            >
              <p
                className={`
                font-medium mb-2
                ${isGridView ? "hidden" : "text-gray-900"}
              `}
              >
                {item.prompt}
              </p>
              {/* <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div> */}
            </div>

            {/* Actions */}
            <div
              className={`
              flex items-center gap-2
              ${
                isGridView
                  ? "absolute bottom-4 left-2 right-2 p-2 rounded-lg bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  : ""
              }
            `}
            >
              <button
                onClick={() => handleDownload(item.imageUrls[0])}
                className={`
                  p-2 rounded-lg
                  ${
                    isGridView
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }
                `}
                title="Download"
              >
                <Download className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  const newSelected = new Set(selectedItems);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (newSelected.has(item.id as any)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newSelected.delete(item.id as any);
                  } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newSelected.add(item.id as any);
                  }
                  setSelectedItems(newSelected);
                }}
                className={`
                  p-2 rounded-lg
                  ${
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    selectedItems.has(item.id as any)
                      ? "bg-blue-500 text-white"
                      : isGridView
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }
                `}
                title={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  selectedItems.has(item.id as any) ? "Deselect" : "Select"
                }
              >
                {" "}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {selectedItems.has(item.id as any) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!previewImage}
        onClose={() => {
          setPreviewImage(null);
          setZoomLevel(100);
          setImagePosition({ x: 0, y: 0 });
        }}
      >
        <div className="h-full flex flex-col ">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <CustomSlider
                value={zoomLevel}
                onChange={setZoomLevel}
                min={50}
                max={200}
              />
              <span className="text-sm text-gray-500">{zoomLevel}%</span>
            </div>
            <button
              onClick={() => {
                setPreviewImage(null);
                setZoomLevel(100);
                setImagePosition({ x: 0, y: 0 });
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-hidden relative">
            {previewImage && (
              <>
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      transform: `translate(${imagePosition.x}px, ${
                        imagePosition.y
                      }px) scale(${zoomLevel / 100})`,
                      transition: isDragging ? "none" : "transform 0.2s",
                      cursor: isDragging ? "grabbing" : "grab",
                    }}
                    className="max-w-full max-h-full"
                  />
                </div>

                {/* Navigation Buttons */}
                {/* <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : filteredItems.length - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev < filteredItems.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button> */}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500">
              {filteredItems[selectedImageIndex]?.prompt}
            </p>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default HistoryPanel;
