"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Menu, X, ChevronDown } from "lucide-react";
import FeatureDropdown from "./FeatureDropdown";
import { cn } from "@/utils/cn";

type NavItem = {
  name: string;
  href: string;
  hasDropdown?: boolean;
};

interface NavbarProps {
  className?: string;
}

const navItems: NavItem[] = [
  { name: "Models", href: "#", hasDropdown: true },
  { name: "Pricing", href: "/pricing" },
  { name: "About us", href: "/about-us" },
];

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-gray-100" : "border-transparent",
        className as string
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-all duration-300",
          scrolled
            ? "bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
            : "bg-transparent"
        )}
      />

      <MaxWidthWrapper className="relative">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 transition-opacity hover:opacity-90"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 animate-gradient" />
              <span className="relative flex items-center justify-center h-full text-white font-bold text-xl">
                Ai
              </span>
            </div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              ImaginAi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="flex items-center space-x-1 bg-gray-50/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-100">
              {navItems.map(({ name, href, hasDropdown }) => (
                <div
                  key={name}
                  className=""
                  onMouseEnter={() =>
                    setShowProductDropdown(hasDropdown ?? false)
                  }
                  onMouseLeave={() => setShowProductDropdown(false)}
                >
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center space-x-1.5 text-sm font-medium transition-all duration-200 rounded-full px-4 py-2",
                      pathname === href
                        ? "text-white bg-black shadow-sm"
                        : "text-gray-700 hover:bg-gray-100/70"
                    )}
                  >
                    <span>{name}</span>
                    {hasDropdown && (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>

                  {hasDropdown && (
                    <FeatureDropdown
                      isVisible={showProductDropdown}
                      isMobile={false}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium bg-black text-white px-6 py-2.5 rounded-full transition-all hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex relative  gap-2 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {/* <div>
              <Link
                // onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden relative z-50 p-1 rounded-xl text-sm font-medium bg-black text-white px-6 py-1.5 transition-colors hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                // aria-label="Toggle Menu"
                href={"/login"}
              >
                Sign in
              </Link>
            </div> */}
            {menuOpen ? (
              <X className="text-gray-900" size={24} />
            ) : (
              <Menu className="text-gray-900" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 bg-white z-40 transition-all duration-300",
            menuOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full pointer-events-none"
          )}
        >
          <div className="flex flex-col h-full pt-24 pb-6 px-6 space-y-2">
            {navItems.map(({ name, href, hasDropdown }) => (
              <div key={name}>
                {hasDropdown ? (
                  <FeatureDropdown isVisible={true} isMobile={true} />
                ) : (
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {name}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-8 space-y-4">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-900 transition-colors"
              >
                Sign in{" "}
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
