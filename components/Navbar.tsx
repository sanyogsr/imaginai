"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Product", href: "/product", hasDropdown: true },
  { name: "Resources", href: "/resources" },
  { name: "Customers", href: "/customers" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
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
    <div className={`sticky top-0 z-50 w-full transition-all border border-b`}>
      <div
        className={`absolute inset-0 transition-all ${
          scrolled ? "bg-white/80 backdrop-blur-md " : ""
        }`}
      />

      <MaxWidthWrapper className="relative">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ImaginAi
          </Link>

          {/* Desktop Links - Now centered and with login/signup */}
          <div className="hidden lg:flex flex-1 items-center justify-center ">
            <div className="flex items-center space-x-8 border p-1 rounded-lg">
              {navItems.map(({ name, href, hasDropdown }) => (
                <div
                  key={name}
                  className="relative group"
                  onMouseEnter={() =>
                    setShowProductDropdown(hasDropdown ?? false)
                  }
                  onMouseLeave={() => setShowProductDropdown(false)}
                >
                  <Link
                    href={href}
                    className={`text-sm font-medium transition-colors rounded-md px-3 py-2 ${
                      pathname === href
                        ? "text-black dark:text-white"
                        : "text-gray-700 hover:text-black dark:hover:text-gray-400"
                    }`}
                  >
                    {name}
                  </Link>

                  {/* Dropdown for 'Product' */}
                  {hasDropdown && (
                    <div
                      className={`absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 transition-opacity transform duration-300 ease-in-out z-50 ${
                        showProductDropdown
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    >
                      <Link
                        href="/product/feature-1"
                        className="block text-sm text-gray-600 hover:text-black dark:text-gray-300"
                      >
                        Feature 1
                      </Link>
                      <Link
                        href="/product/feature-2"
                        className="block text-sm text-gray-600 hover:text-black dark:text-gray-300"
                      >
                        Feature 2
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Login/Signup */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-md focus:outline-none z-50"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <X className="text-black " size={24} />
            ) : (
              <Menu className="text-black " size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 bg-white  text-black dark:text-white z-40 transition-transform duration-300 transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {navItems.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-xl font-medium transition-colors ${
                  pathname === href
                    ? "text-black dark:text-white"
                    : "text-gray-700 hover:text-black dark:hover:text-gray-400"
                }`}
              >
                {name}
              </Link>
            ))}
            <div className="flex gap-4 items-center">
              <Link href="/login" className="text-gray-600 hover:text-black">
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
