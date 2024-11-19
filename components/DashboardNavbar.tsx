"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  History,
  Search,
  Command,
  X,
  UserCircle,
  Crown,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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
    description: "Generate images from another image with AI",
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
  {
    id: "history",
    label: "History",
    icon: History,
    url: "/dashboard/history",
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    url: "/dashboard/profile",
  },
];

const Header = () => {
  const [activeTab, setActiveTab] = useState("image-gen");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();
  const { credits, fetchCredits } = userCreditsStore();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  // Auto-close dropdowns on navigation
  useEffect(() => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns when clicking outside
  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const handleClickOutside = (event: any) => {
  //     const target = event.target;
  //     if (!target.closest(".profile-menu")) setProfileOpen(false);
  //     if (!target.closest(".mobile-menu")) setMobileMenuOpen(false);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        mobileButtonRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !mobileButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }

      if (!target.parentElement?.closest(".profile-menu")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);
  // Keyboard shortcuts
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeyDown = (e: any) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (searchOpen) {
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, selectedIndex, filteredTools]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    ImaginAI
                  </span>
                </Link>
              </h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium relative group transition-all duration-200
                      ${
                        activeTab === tool.id
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    disabled={tool.comingSoon}
                  >
                    <span className="flex items-center gap-2">
                      <span className="transform group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </span>
                      {tool.title}
                    </span>
                    {tool.isNew && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full shadow-lg animate-pulse">
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

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Credits Display */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl">
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {credits} Credits
                </span>
              </div>

              {/* Profile Menu */}
              <div className="relative profile-menu">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-0.5">
                    <Image
                      src={session.data?.user?.image ?? "/default-avatar.png"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 transform transition-all">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.data?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.data?.user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {profileMenuItems.map((item) => {
                        const Icon = item.icon;
                        if (item.id === "logout") {
                          return (
                            <button
                              key={item.id}
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.id}
                            href={item.url}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={mobileButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors relative z-50"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                <Menu
                  className={`w-5 h-5 transition-transform duration-200 ${
                    mobileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            ref={mobileMenuRef}
            className={`md:hidden absolute left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-200 ease-in-out ${
              mobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <nav className="flex flex-col space-y-2 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium relative group transition-all duration-200
                    ${
                      activeTab === tool.id
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  disabled={tool.comingSoon}
                >
                  <span className="flex items-center gap-2">
                    <span className="transform group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </span>
                    {tool.title}
                  </span>
                  {tool.isNew && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full shadow-sm">
                      New
                    </span>
                  )}
                  {tool.comingSoon && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-gray-400 text-white text-xs rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSearchOpen(false)}
            />

            <div className="inline-block w-full max-w-2xl my-16 text-left align-middle transition-all transform">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
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
                    onClick={() => setSearchOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {filteredTools.map((tool, index) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setActiveTab(tool.id);
                          setSearchOpen(false);
                        }}
                        className={`w-full flex items-start space-x-4 p-4 rounded-xl transition-all
                          ${
                            selectedIndex === index
                              ? "bg-blue-50 text-blue-600"
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
                          <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full">
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

                    {filteredTools.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No results found
                        </h3>
                        <p className="text-sm text-gray-500">
                          Try searching with different keywords
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keyboard Shortcuts Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-white rounded-lg shadow-sm border border-gray-200">
                        ↑↓
                      </kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-white rounded-lg shadow-sm border border-gray-200">
                        ↵
                      </kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <kbd className="px-2 py-1 bg-white rounded-lg shadow-sm border border-gray-200">
                        esc
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

      {/* Mobile Credits Display (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden z-40">
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4">
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl max-w-xs mx-auto">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {credits} Credits Available
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
