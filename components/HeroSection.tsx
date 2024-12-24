// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import img1 from "../assets/images/1.png";
// import img2 from "../assets/images/2.png";
// import img3 from "../assets/images/3.png";
// import img4 from "../assets/images/4.png";
// import img5 from "../assets/images/5.png";
// import img6 from "../assets/images/6.png";

// const ModernHeroSection = () => {
//   const thumbnails = [
//     {
//       id: 1,
//       title: "Minecraft In Real Life",
//       views: "500,000+ views",
//       position: "left-[15%] top-[5%]",
//       width: "w-64",
//       rotate: "-rotate-12",
//       url: img1,
//     },
//     {
//       id: 2,
//       title: "TRAIN Yourself Like Ayanokoji",
//       views: "800,000+ views",
//       position: "left-[35%] top-[28%]",
//       width: "w-72",
//       rotate: "rotate-6",
//       url: img2,
//     },
//     {
//       id: 3,
//       title: "Study like Pro",
//       views: "300,000+ views",
//       position: "left-[10%] bottom-[15%]",
//       width: "w-56",
//       rotate: "-rotate-6",
//       url: img3,
//     },
//     {
//       id: 4,
//       title: "People Are Scared of AI",
//       views: "600,000+ views",
//       position: "right-[12%] top-[8%]",
//       width: "w-64",
//       rotate: "rotate-12",
//       url: img4,
//     },
//     {
//       id: 5,
//       title: "Survive In The Wilderness and Win",
//       views: "200,000+ views",
//       position: "right-[32%] top-[35%]",
//       width: "w-72",
//       rotate: "-rotate-6",
//       url: img5,
//     },
//     {
//       id: 6,
//       title: "100 Hour Minecraft",
//       views: "400,000+ views",
//       position: "right-[15%] bottom-[20%]",
//       width: "w-56",
//       rotate: "rotate-12",
//       url: img6,
//     },
//   ];

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-black rounded-2xl">
//       {/* Optimized background patterns - reduced number of elements and simplified gradients */}
//       <div className="absolute inset-0">
//         {" "}
//         <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,#4F46E5_0%,transparent_50%)] opacity-30" />{" "}
//         <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_right,#EC4899_0%,transparent_50%)] opacity-20" />{" "}
//       </div>

//       {/* Main content */}
//       <div className="relative z-10">
//         {/* Hero Text Section */}
//         <div className="text-center relative z-20 pt-20 pb-10">
//           <div className="space-y-6 px-4">
//             <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-pink-500 pb-2">
//               Text to Image in Seconds with AI
//             </h1>
//             <p className="text-sm md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
//               Ready to share your images on Instagram?
//             </p>
//             <div className="mt-12">
//               <Link
//                 href="/login"
//                 className="group relative inline-flex items-center px-8 py-3 md:px-12 md:py-6 text-2xl font-bold text-white bg-black border-2 border-purple-500 transition-transform duration-300 hover:scale-105"
//               >
//                 <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out group-hover:w-full" />
//                 <span className="relative">Get Started</span>
//               </Link>
//             </div>
//             <p className="mt-6 text-gray-400">No credit card required</p>
//           </div>
//         </div>

//         {/* Optimized Thumbnails Section */}
//         <div className="hidden md:block relative h-[45rem] mx-auto max-w-7xl">
//           {thumbnails.map((thumb) => (
//             <div
//               key={thumb.id}
//               className={`absolute ${thumb.position} ${thumb.width} ${thumb.rotate} transition-transform duration-300 hover:scale-105 hover:z-50`}
//             >
//               <div className="group relative">
//                 <div className="relative bg-gray-800/90 rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
//                   <div className="relative overflow-hidden">
//                     <Image
//                       src={thumb.url}
//                       alt={thumb.title}
//                       width={400}
//                       height={300}
//                       className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
//                       loading="lazy"
//                       quality={75}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>
//                   <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//                     <h3 className="text-white font-medium text-lg mb-1 truncate">
//                       {thumb.title}
//                     </h3>
//                     <p className="text-gray-300 text-sm">{thumb.views}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Vertical layout for smaller screens */}
//         <div className="block md:hidden flex flex-col items-center gap-8">
//           {thumbnails.map((thumb) => (
//             <div key={thumb.id} className="w-48">
//               <div className="relative bg-gray-800/90 rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
//                 <div className="relative overflow-hidden">
//                   <Image
//                     src={thumb.url}
//                     alt={thumb.title}
//                     width={400}
//                     height={300}
//                     className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
//                     loading="lazy"
//                     quality={75}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-white font-medium text-lg mb-1 truncate">
//                     {thumb.title}
//                   </h3>
//                   <p className="text-gray-300 text-sm">{thumb.views}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModernHeroSection;

import React from "react";
import Image from "next/image";
import Link from "next/link";

const ModernHeroSection = () => {
  const thumbnails = [
    {
      id: 1,
      title: "Minecraft In Real Life",
      views: "500,000+ views",
      position: "left-[15%] top-[5%]",
      width: "w-64",
      rotate: "-rotate-12",
      url: "/images/1.png",
      category: "Adventure",
    },
    {
      id: 2,
      title: "TRAIN Yourself Like Ayanokoji",
      views: "800,000+ views",
      position: "left-[35%] top-[28%]",
      width: "w-72",
      rotate: "rotate-6",
      url: "/images/2.png",
      category: "Adventure",
    },
    {
      id: 3,
      title: "Study like Pro",
      views: "300,000+ views",
      position: "left-[10%] bottom-[15%]",
      width: "w-56",
      rotate: "-rotate-6",
      url: "/images/3.png",
      category: "Adventure",
    },
    {
      id: 4,
      title: "People Are Scared of AI",
      views: "600,000+ views",
      position: "right-[12%] top-[8%]",
      width: "w-64",
      rotate: "rotate-12",
      url: "/images/4.png",
      category: "Adventure",
    },
    {
      id: 5,
      title: "Survive In The Wilderness and Win",
      views: "200,000+ views",
      position: "right-[32%] top-[35%]",
      width: "w-72",
      rotate: "-rotate-6",
      url: "/images/5.png",
      category: "Adventure",
    },
    {
      id: 6,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/6.png",
      category: "Adventure",
    },

    {
      id: 7,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/7.png",
      category: "Adventure",
    },
    {
      id: 8,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/8.png",
      category: "Adventure",
    },
    {
      id: 9,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/9.png",
      category: "Adventure",
    },
    {
      id: 10,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/10.png",
      category: "Adventure",
    },
    {
      id: 11,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/11.png",
      category: "Adventure",
    },
    {
      id: 12,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/12.png",
      category: "Adventure",
    },
    {
      id: 13,
      title: "100 Hour Minecraft",
      views: "400,000+ views",
      position: "right-[15%] bottom-[20%]",
      width: "w-56",
      rotate: "rotate-12",
      url: "/images/13.png",
      category: "Adventure",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#E3D0FF] rounded-2xl">
      <div className="relative z-10 px-2 sm:px-6 lg:px-8">
        {/* Hero Text Section */}
        <div className="text-center pt-20 pb-16 max-w-5xl mx-auto">
          {/* Animated Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
            <span className="block">Turn Text into Images</span>
            <span className="block mt-2 text-[#6C63FF]">in Seconds</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-sm sm:text-xl text-[#5B4F99] max-w-2xl mx-auto leading-relaxed">
            Start generating image in just 2₹ 🚀
          </p>

          {/* Call to Action */}
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 text-xl sm:text-2xl font-extrabold  text-white bg-black rounded-lg shadow-md hover:bg-[#5A52E3] transform transition-all hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
            <p className="mt-4 text-sm text-[#5B4F99]">
              No cap, no credit card needed rn
            </p>
          </div>
        </div>
        {/* Thumbnails Grid */}
        <div className="max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.id}
                className="group relative bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl"
              >
                <div className="aspect-video relative">
                  <Image
                    src={thumb.url}
                    alt={thumb.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#7F4CF5]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
