"use client";

import React, { useState, useEffect } from "react";

// Advanced Interfaces
interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  description?: string;
  isNew?: boolean;
  isExperimental?: boolean;
}
interface SidebarProps {
  activeRoute: string;
  onRouteChange: (route: string) => void;
}

const AdvancedSidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onRouteChange,
}) => {
  // State Management
  // const [isActive, setActiveRoute] = useState();
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation Categories
  const navigationCategories: NavigationItem[] = [
    {
      href: "/dashboard/text-to-image",
      label: "Text to Image",
      icon: <span>🖼️</span>,
    },
    {
      href: "/dashboard/image-to-image",
      label: "Image to Image",
      icon: <span>🎨</span>,
    },
    {
      href: "/dashboard/text-to-video",
      label: "Text to Video",
      icon: <span>🎥</span>,
    },
    {
      href: "/dashboard/image-to-video",
      label: "Image to Video",
      icon: <span>📽️</span>,
    },
    {
      href: "/dashboard/anime-photos",
      label: "Anime AI",
      icon: <span>🖌️</span>,
    },
    {
      href: "/dashboard/sticker-ai",
      label: "Sticker AI",
      icon: <span>📜</span>,
    },
  ];

  // Screen Size Detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 638) setScreenSize("sm");
      else if (width >= 638 && width < 1024) setScreenSize("md");
      else if (width < 1280) setScreenSize("lg");
      else setScreenSize("xl");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render Navigation for Different Screen Sizes
  const renderNavigation = () => {
    switch (screenSize) {
      case "sm":
        return (
          <div className="w-full overflow-x-auto bg-white">
            <div className="flex space-x-4 p-4">
              {navigationCategories.map((category) => (
                <div
                  key={category.href}
                  className={`
                    flex-shrink-0 cursor-pointer flex items-center 
                    space-x-2 px-3 py-2 rounded-md font-bold 
                    ${
                      activeRoute === category.href
                        ? "bg-purple-700 text-white"
                        : "text-gray-700 hover:bg-purple-100"
                    }
                  `}
                  onClick={() => onRouteChange(category.href)}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "md":
        return (
          <div className="w-full overflow-x-auto bg-white shadow-md">
            <div className="flex space-x-4 p-4">
              {navigationCategories.map((category) => (
                <div
                  key={category.href}
                  className={`
                    flex-shrink-0 cursor-pointer flex items-center 
                    space-x-2 px-3 py-2 rounded-md font-bold 
                    ${
                      activeRoute === category.href
                        ? "bg-purple-700 text-white"
                        : "text-gray-700 hover:bg-purple-100"
                    }
                  `}
                  onClick={() => onRouteChange(category.href)}
                >
                  {category.icon}
                  <span className="whitespace-nowrap">{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "lg":
      case "xl":
        return (
          <div
            className={`
              sticky top-0 h-screen bg-white border border-black  
              transition-all duration-300 ease-in-out rounded-md
              ${isCollapsed ? "w-20 p-2" : "w-[20rem] p-5"}
            `}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-4">
                {!isCollapsed && (
                  <h2 className="text-2xl font-bold text-gray-800">
                    Dashboard
                  </h2>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="ml-auto p-2 hover:bg-gray-100 rounded-lg"
                >
                  {isCollapsed ? "→" : "←"}
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-grow overflow-y-auto">
                {navigationCategories.map((category) => {
                  const isActive = activeRoute === category.href;
                  return (
                    <div
                      key={category.href}
                      className={`
                        relative cursor-pointer flex items-center space-x-3 p-3 
                        transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-purple-700 text-white rounded-md"
                            : "text-gray-700 hover:bg-purple-100"
                        }
                      `}
                      onClick={() => onRouteChange(category.href)}
                    >
                      <div className="flex-shrink-0">{category.icon}</div>

                      {!isCollapsed && (
                        <span className="font-medium">{category.label}</span>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        );
    }
  };

  return renderNavigation();
};

export default AdvancedSidebar;
