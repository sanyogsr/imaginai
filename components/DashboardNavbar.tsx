"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Crown,
  History,
  UserCircle,
  Search,
  Command,
  Sparkles,
  Instagram,
  Twitter,
  Video,
  X,
  LucideIcon,
} from "lucide-react";

interface Tool {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const tools: Tool[] = [
  {
    name: "Ads Creator",
    href: "/tutorials",
    icon: Sparkles,
    description: "Create compelling ad content with AI",
  },
  {
    name: "Instagram Post Creator",
    href: "/tools/insta-post-creator",
    icon: Instagram,
    description: "Design engaging Instagram posts",
  },
  {
    name: "Twitter Post Creator",
    href: "/tools/twitter-post-creator",
    icon: Twitter,
    description: "Craft viral tweets with AI assistance",
  },
  {
    name: "AI Shorts Generator",
    href: "/tools/ai-shorts-generator",
    icon: Video,
    description: "Generate viral short-form videos",
  },
];

const dashboardNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Upgrade", href: "/dashboard/upgrade", icon: Crown },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Memoize filtered tools to prevent unnecessary recalculations
  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
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
            window.location.href = filteredTools[selectedIndex].href;
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

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  };

  return (
    <>
      {/* Your existing navbar code... */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all">
        <div
          className={`w-full transition-all duration-300 ${
            scrolled
              ? "bg-white/80 backdrop-blur-xl shadow-lg"
              : "bg-white/50 backdrop-blur-sm"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-[4rem] items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Ai</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  ImaginAi
                </span>
              </Link>

              {/* Search Bar */}
              <div className="hidden lg:flex items-center max-w-md w-full mx-4">
                <div className="relative w-full">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Quick Search.."
                    onFocus={() => setSearchOpen(true)}
                    className="w-full pl-10 py-2 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-purple-500 transition-all outline-none"
                  />

                  <div className="absolute top-2.5 right-3 text-gray-400">
                    Ctrl+k
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {dashboardNavItems.map(({ name, href, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* `Mobile` Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span
                    className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${
                      menuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${
                      menuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
          {/* Mobile Menu Dropdown */}
          <div
            id="mobile-menu"
            className={`lg:hidden transition-all duration-300 overflow-hidden ${
              menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-xl shadow-lg">
              {/* Mobile Search */}
              <div className="p-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Quick Search.."
                    onClick={() => setSearchOpen(true)}
                    className="w-full pl-10 py-2 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-purple-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Mobile Navigation Items */}
              {dashboardNavItems.map(({ name, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={name}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Command Palette Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="command-palette"
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={handleSearchClose}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-2xl my-16 text-left align-middle transition-all transform">
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Header */}
                <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
                  <Command size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
                    autoFocus
                  />
                  <button
                    onClick={handleSearchClose}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Close search"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="p-2">
                    {filteredTools.map((tool, index) => {
                      const Icon = tool.icon;
                      const isSelected = selectedIndex === index;

                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          onClick={handleSearchClose}
                          className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 ${
                            isSelected
                              ? "bg-purple-50 dark:bg-purple-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected
                                ? "bg-purple-100 dark:bg-purple-900/40"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <Icon
                              size={24}
                              className={`${
                                isSelected
                                  ? "text-purple-600 dark:text-purple-400"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                isSelected
                                  ? "text-purple-600 dark:text-purple-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {tool.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {tool.description}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              Press enter to select
                            </span>
                          )}
                        </Link>
                      );
                    })}
                    {filteredTools.length === 0 && (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No tools found. Try a different search term.
                      </div>
                    )}
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        ↑↓
                      </kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        Enter
                      </kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        Esc
                      </kbd>
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
}
