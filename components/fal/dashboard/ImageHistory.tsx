"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { HistoryItem, useHistoryStore } from "@/store/useHistoryStore";
import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";

// Advanced filter and search types
type FilterOption = "date" | "size" | "model" | "style";
type SortDirection = "asc" | "desc";

const CompactImageHistory: React.FC = () => {
  const { history, fetchHistory, removeFromHistory } = useHistoryStore();
  const session = useSession();

  // State management for advanced features
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  //   const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [sortBy, setSortBy] = useState<FilterOption>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  //   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  // Refs for interactive elements
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Pagination and display constants
  const imagesPerPage = 8;
  const filterOptions: FilterOption[] = ["date", "size", "model", "style"];

  // Effect for initial data fetching
  useEffect(() => {
    if (session.data?.user?.id) {
      fetchHistory(session.data.user.id as string);
    }
  }, [session]);

  // Advanced filtering and sorting logic
  const processedHistory = useMemo(() => {
    const filteredHistory = history.filter((item) =>
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    filteredHistory.sort((a, b) => {
      const getValue = (item: HistoryItem, key: FilterOption) => {
        switch (key) {
          case "date":
            return new Date(item.timestamp).getTime();
          case "size":
            return parseInt(item.size.split("x")[0]);
          case "model":
            return item.model;
          case "style":
            return item.style;
          default:
            return 0;
        }
      };

      const multiplier = sortDirection === "asc" ? 1 : -1;
      return multiplier * (getValue(a, sortBy) > getValue(b, sortBy) ? 1 : -1);
    });

    return filteredHistory;
  }, [history, searchQuery, sortBy, sortDirection]);

  // Pagination calculation
  const paginatedImages = processedHistory.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );
  const totalPages = Math.ceil(processedHistory.length / imagesPerPage);

  // Download handler with enhanced error management
  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download image");
    }
  };

  // Bulk action handlers
  const handleBulkDownload = () => {
    selectedImages.forEach((id) => {
      const image = history.find((item) => item.id === id);
      if (image) handleDownload(image.imageUrls[0]);
    });
  };

  const handleBulkDelete = () => {
    selectedImages.forEach((id) => removeFromHistory(id));
    setSelectedImages([]);
  };

  // Render method
  return (
    <div className="rounded-lg h-full w-80 bg-neutral-900/90 backdrop-blur-sm shadow-2xl transition-all duration-300 ease-in-out">
      {/* Header with Search and Filters */}
      <div className="p-4 border-b border-neutral-800">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute right-3 top-3 text-neutral-500"
            size={18}
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          onClick={() => setIsAdvancedOptionsOpen(!isAdvancedOptionsOpen)}
          className="mt-2 w-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          <Settings size={16} className="mr-2" />
          {isAdvancedOptionsOpen ? "Hide" : "Show"} Advanced Options
        </button>

        {isAdvancedOptionsOpen && (
          <div className="mt-2 space-y-2">
            {/* Sorting Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FilterOption)}
                className="bg-neutral-800 text-white rounded-md px-2 py-1"
              >
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="text-neutral-400 hover:text-white"
              >
                {sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="p-2 space-y-2 overflow-y-auto h-[calc(100%-200px)]">
        {paginatedImages.map((item) => (
          <div
            key={item.id}
            className={`
              flex items-center p-2 rounded-lg transition-all 
              ${
                selectedImages.includes(item.id)
                  ? "bg-blue-900/30 border-2 border-blue-600"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }
            `}
          >
            <input
              type="checkbox"
              checked={selectedImages.includes(item.id)}
              onChange={() => {
                setSelectedImages((prev) =>
                  prev.includes(item.id)
                    ? prev.filter((id) => id !== item.id)
                    : [...prev, item.id]
                );
              }}
              className="mr-2 accent-blue-500"
            />
            <img
              src={item.imageUrls[0]}
              alt={item.prompt}
              className="w-16 h-16 object-cover rounded-md mr-2"
            />
            <div className="flex-grow">
              <p className="text-xs text-neutral-300 truncate">{item.prompt}</p>
              <div className="text-xs text-neutral-500 flex space-x-2 mt-1">
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                <span>·</span>
                <span>{item.model}</span>
              </div>
            </div>
            <button
              onClick={() => handleDownload(item.imageUrls[0])}
              className="text-neutral-400 hover:text-white ml-2"
            >
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Bulk Actions and Pagination */}
      <div className="absolute bottom-0 left-0 w-full p-2 bg-neutral-800/80 backdrop-blur-sm">
        {selectedImages.length > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-neutral-400">
              {selectedImages.length} images selected
            </span>
            <div className="space-x-2">
              <button
                onClick={handleBulkDownload}
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-700"
              >
                Download Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-2 py-1 rounded-md text-xs hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-neutral-400 disabled:opacity-30 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-neutral-400">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-neutral-400 disabled:opacity-30 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompactImageHistory;
