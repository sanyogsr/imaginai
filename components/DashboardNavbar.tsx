// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Home,
//   Crown,
//   History,
//   UserCircle,
//   Search,
//   Command,
//   Sparkles,
//   Instagram,
//   Twitter,

//   X,
//   LucideIcon,
// } from "lucide-react";

// interface Tool {
//   name: string;
//   href: string;
//   icon: LucideIcon;
//   description: string;
// }

// interface NavItem {
//   name: string;
//   href: string;
//   icon: LucideIcon;
// }

// const tools: Tool[] = [
//   {
//     name: "Ads Creator",
//     href: "/tools/ad-creator",
//     icon: Sparkles,
//     description: "Create compelling ad content with AI",
//   },
//   {
//     name: "Instagram Post Creator",
//     href: "/tools/insta-post-creator",
//     icon: Instagram,
//     description: "Design engaging Instagram posts",
//   },
//   {
//     name: "Twitter Post Creator",
//     href: "/tools/twitter-post-creator",
//     icon: Twitter,
//     description: "Craft viral tweets with AI assistance",
//   },
// ];

// const dashboardNavItems: NavItem[] = [
//   { name: "Dashboard", href: "/dashboard", icon: Home },
//   { name: "Upgrade", href: "/dashboard/upgrade", icon: Crown },
//   { name: "History", href: "/dashboard/history", icon: History },
//   { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
// ];

// export default function DashboardNavbar() {
//   const pathname = usePathname();
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   // Memoize filtered tools to prevent unnecessary recalculations
//   const filteredTools = useMemo(() => {
//     return tools.filter(
//       (tool) =>
//         tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchQuery]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === "k") {
//         e.preventDefault();
//         setSearchOpen(true);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   useEffect(() => {
//     const handleKeyNavigation = (e: KeyboardEvent) => {
//       if (!searchOpen) return;

//       switch (e.key) {
//         case "ArrowDown":
//           e.preventDefault();
//           setSelectedIndex((prev) =>
//             Math.min(prev + 1, filteredTools.length - 1)
//           );
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           setSelectedIndex((prev) => Math.max(prev - 1, 0));
//           break;
//         case "Enter":
//           e.preventDefault();
//           if (filteredTools[selectedIndex]) {
//             window.location.href = filteredTools[selectedIndex].href;
//             setSearchOpen(false);
//           }
//           break;
//         case "Escape":
//           setSearchOpen(false);
//           break;
//       }
//     };

//     window.addEventListener("keydown", handleKeyNavigation);
//     return () => window.removeEventListener("keydown", handleKeyNavigation);
//   }, [searchOpen, selectedIndex, filteredTools]);

//   // Reset selected index when search query changes
//   useEffect(() => {
//     setSelectedIndex(0);
//   }, [searchQuery]);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 0);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearchClose = () => {
//     setSearchOpen(false);
//     setSearchQuery("");
//     setSelectedIndex(0);
//   };

//   return (
//     <>
//       {/* Your existing navbar code... */}
//       <div className="fixed top-0 left-0 right-0 z-50 transition-all">
//         <div
//           className={`w-full transition-all duration-300 ${
//             scrolled
//               ? "bg-white/80 backdrop-blur-xl shadow-lg"
//               : "bg-white/50 backdrop-blur-sm"
//           }`}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex h-[4rem] items-center justify-between">
//               {/* Logo */}
//               <Link href="/" className="flex items-center space-x-2">
//                 <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">Ai</span>
//                 </div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//                   ImaginAi
//                 </span>
//               </Link>

//               {/* Search Bar */}
//               <div className="hidden lg:flex items-center max-w-md w-full mx-4">
//                 <div className="relative w-full">
//                   <Search
//                     className="absolute left-3 top-2.5 text-gray-400"
//                     size={20}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Quick Search.."
//                     onFocus={() => setSearchOpen(true)}
//                     className="w-full pl-10 py-2 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-purple-500 transition-all outline-none"
//                   />

//                   <div className="absolute top-2.5 right-3 text-gray-400">
//                     Ctrl+k
//                   </div>
//                 </div>
//               </div>

//               {/* Desktop Navigation */}
//               <nav className="hidden lg:flex items-center space-x-1">
//                 {dashboardNavItems.map(({ name, href, icon: Icon }) => {
//                   const isActive = pathname === href;
//                   return (
//                     <Link
//                       key={name}
//                       href={href}
//                       className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-200 ${
//                         isActive
//                           ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
//                           : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       <Icon size={20} />
//                       <span className="font-medium">{name}</span>
//                     </Link>
//                   );
//                 })}
//               </nav>

//               {/* `Mobile` Menu Button */}
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
//               >
//                 <div className="w-6 h-5 flex flex-col justify-between">
//                   <span
//                     className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${
//                       menuOpen ? "rotate-45 translate-y-2" : ""
//                     }`}
//                   />
//                   <span
//                     className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${
//                       menuOpen ? "opacity-0" : ""
//                     }`}
//                   />
//                   <span
//                     className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${
//                       menuOpen ? "-rotate-45 -translate-y-2" : ""
//                     }`}
//                   />
//                 </div>
//               </button>
//             </div>
//           </div>
//           {/* Mobile Menu Dropdown */}
//           <div
//             id="mobile-menu"
//             className={`lg:hidden transition-all duration-300 overflow-hidden ${
//               menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-xl shadow-lg">
//               {/* Mobile Search */}
//               <div className="p-2">
//                 <div className="relative">
//                   <Search
//                     className="absolute left-3 top-2.5 text-gray-400"
//                     size={20}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Quick Search.."
//                     onClick={() => setSearchOpen(true)}
//                     className="w-full pl-10 py-2 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-purple-500 transition-all outline-none"
//                   />
//                 </div>
//               </div>

//               {/* Mobile Navigation Items */}
//               {dashboardNavItems.map(({ name, href, icon: Icon }) => {
//                 const isActive = pathname === href;
//                 return (
//                   <Link
//                     key={name}
//                     href={href}
//                     onClick={() => setMenuOpen(false)}
//                     className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
//                       isActive
//                         ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
//                         : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     <Icon size={20} />
//                     <span className="font-medium">{name}</span>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Command Palette Modal */}
//       {searchOpen && (
//         <div
//           className="fixed inset-0 z-50 overflow-y-auto"
//           aria-labelledby="command-palette"
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="min-h-screen px-4 text-center">
//             {/* Backdrop */}
//             <div
//               className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
//               aria-hidden="true"
//               onClick={handleSearchClose}
//             />

//             {/* Modal */}
//             <div className="inline-block w-full max-w-2xl my-16 text-left align-middle transition-all transform">
//               <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
//                 {/* Search Header */}
//                 <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
//                   <Command size={20} className="text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search tools..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
//                     autoFocus
//                   />
//                   <button
//                     onClick={handleSearchClose}
//                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//                     aria-label="Close search"
//                   >
//                     <X size={20} className="text-gray-400" />
//                   </button>
//                 </div>

//                 {/* Search Results */}
//                 <div className="max-h-[60vh] overflow-y-auto">
//                   <div className="p-2">
//                     {filteredTools.map((tool, index) => {
//                       const Icon = tool.icon;
//                       const isSelected = selectedIndex === index;

//                       return (
//                         <Link
//                           key={tool.name}
//                           href={tool.href}
//                           onClick={handleSearchClose}
//                           className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 ${
//                             isSelected
//                               ? "bg-purple-50 dark:bg-purple-900/20"
//                               : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
//                           }`}
//                         >
//                           <div
//                             className={`p-2 rounded-lg ${
//                               isSelected
//                                 ? "bg-purple-100 dark:bg-purple-900/40"
//                                 : "bg-gray-100 dark:bg-gray-800"
//                             }`}
//                           >
//                             <Icon
//                               size={24}
//                               className={`${
//                                 isSelected
//                                   ? "text-purple-600 dark:text-purple-400"
//                                   : "text-gray-600 dark:text-gray-400"
//                               }`}
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <h3
//                               className={`font-medium ${
//                                 isSelected
//                                   ? "text-purple-600 dark:text-purple-400"
//                                   : "text-gray-900 dark:text-white"
//                               }`}
//                             >
//                               {tool.name}
//                             </h3>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">
//                               {tool.description}
//                             </p>
//                           </div>
//                           {isSelected && (
//                             <span className="text-xs text-gray-400 dark:text-gray-500">
//                               Press enter to select
//                             </span>
//                           )}
//                         </Link>
//                       );
//                     })}
//                     {filteredTools.length === 0 && (
//                       <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//                         No tools found. Try a different search term.
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Keyboard Shortcuts */}
//                 <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
//                     <div className="flex items-center space-x-2">
//                       <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
//                         ↑↓
//                       </kbd>
//                       <span>Navigate</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
//                         Enter
//                       </kbd>
//                       <span>Select</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
//                         Esc
//                       </kbd>
//                       <span>Close</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
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
      <header className="sticky top-0 z-50  bg-white/80 backdrop-blur-lg border-b border-gray-100">
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
                    disabled={tool.comingSoon}
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
