"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  History,
  Search,
  Command,
  X,
  UserCircle,
  Crown,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { userCreditsStore } from "@/store/useCreditStore";
import Image from "next/image";

const tools = [
  {
    id: "image-gen",
    title: "Text to Image",
    icon: "🎨",
    description: "Generate unique images with AI",
    isNew: true,
    comingSoon: false,
  },

  {
    id: "code-gen",
    title: "Image to Image",
    icon: "💻",
    description: "Generate images from another image with Ai",
    isNew: false,
    comingSoon: true,
  },
];

const profileMenuItems = [
  {
    id: "profile",
    label: "Profile",
    icon: UserCircle,
    url: "/dashboard/profile",
  },
  {
    id: "upgrade",
    label: "Upgrade Plan",
    icon: Crown,
    url: "/dashboard/upgrade",
  },
  { id: "history", label: "History", icon: History, url: "/dashboard/history" },
  { id: "logout", label: "Logout", icon: LogOut, url: "/dashboard/profile" },
];

const Header = () => {
  const [activeTab, setActiveTab] = useState("image-gen");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  // const router = useRouter();
  const session = useSession();
  const { credits, fetchCredits } = userCreditsStore();
  // Filter tools based on search query
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);
  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClickOutside = (event: any) => {
      if (profileOpen && !event.target.closest(".profile-menu")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyDown = (e: any) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle search navigation
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyNavigation = (e: any) => {
      if (!searchOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredTools.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredTools[selectedIndex]) {
            setActiveTab(filteredTools[selectedIndex].id);
            setSearchOpen(false);
          }
          break;
        case "Escape":
          setSearchOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [searchOpen, selectedIndex, filteredTools]);

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  };

  return (
    <>
      <header className="sticky top-0  z-50  bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                <Link href={"/dashboard"}>ImaginAI</Link>
              </h1>
              <nav className="hidden md:flex space-x-1">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium relative
                      ${
                        activeTab === tool.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    // disabled={tool.comingSoon}
                  >
                    <span className="flex items-center gap-2">
                      {tool.icon}
                      {tool.title}
                    </span>
                    {tool.isNew && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        New
                      </span>
                    )}
                    {tool.comingSoon && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gray-400 text-white text-xs rounded-full">
                        Soon
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  ⌘K
                </kbd>
              </button>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-600">
                  Credits: {credits}
                </span>
              </div>
              {/* Profile Menu */}
              <div className="relative profile-menu">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center">
                    <Image
                      src={session.data?.user?.image ?? "/default-avatar.png"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.data?.user?.name}{" "}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.data?.user?.email}
                      </p>
                    </div>

                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;

                      // Handle logout action separately
                      if (item.id === "logout") {
                        return (
                          <button
                            key={item.id}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        );
                      }

                      // For other menu items, render the Link as usual
                      return (
                        <Link
                          key={item.id}
                          href={item.url as string}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={handleSearchClose}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-2xl my-16 text-left align-middle transition-all transform">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Header */}
                <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
                  <Command size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 outline-none text-gray-900 placeholder-gray-400 text-lg"
                    autoFocus
                  />
                  <button
                    onClick={handleSearchClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {filteredTools.map((tool, index) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setActiveTab(tool.id);
                          handleSearchClose();
                        }}
                        className={`w-full flex items-start space-x-4 p-4 rounded-xl transition-all ${
                          selectedIndex === index
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        disabled={tool.comingSoon}
                      >
                        <div className="flex-shrink-0 text-2xl">
                          {tool.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-gray-900">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {tool.description}
                          </p>
                        </div>
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                        {tool.comingSoon && (
                          <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                            Soon
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-100 rounded">↑↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>
                      <span>Close</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
