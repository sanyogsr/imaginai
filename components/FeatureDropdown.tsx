"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

const FeatureDropdown = ({
  isVisible,
  isMobile,
}: {
  isVisible: boolean;
  isMobile: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    {
      name: "AI Image Generator",
      description: "Create stunning images with AI technology",
      href: "/login",
      icon: "🎨",
    },
  ];

  // Mobile accordion style dropdown
  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-purple-50 transition-colors"
        >
          <span className="text-gray-900 font-medium">Features</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-4 space-y-2">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-all"
              >
                <span className="text-xl">{feature.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.name}</h3>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}

            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <Link href="/login" className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Ready to get started?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Explore our premium features
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div
      className={`
        absolute left-0 mt-2 
        w-[calc(100vw-2rem)] sm:w-[480px] lg:w-80 
        rounded-2xl bg-white backdrop-blur-xl 
        shadow-lg border border-purple-100 
        transition-all duration-300 transform
        ${
          isVisible
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }
      `}
    >
      <div className="p-4 space-y-4">
        {/* Featured Items */}
        <div className="space-y-2">
          {features.map((feature) => (
            <Link
              key={feature.name}
              href={feature.href}
              className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all">
                <span className="text-xl">{feature.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {feature.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1 hidden sm:block" />
            </Link>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 transition-all">
          <Link
            href="/login"
            className="flex items-center justify-between group"
          >
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                Ready to get started?
              </h3>
              <p className="text-sm text-gray-500 truncate">
                Explore our premium features
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-all transform translate-x-0 group-hover:translate-x-1 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureDropdown;
