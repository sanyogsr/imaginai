import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  // debug: true,
  callbacks: {
    async session({ token, session }) {
      session.user.id = token.sub as string;
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      try {
        await prisma.userCredit.create({
          data: {
            userId: user.id as string,
            credits: 0,
          },
        });
      } catch (error) {
        console.error("Error initializing the user credits : ", error);
      }
    },
  },
});
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
//       category: "Adventure",

//     },
//     {
//       id: 2,
//       title: "TRAIN Yourself Like Ayanokoji",
//       views: "800,000+ views",
//       position: "left-[35%] top-[28%]",
//       width: "w-72",
//       rotate: "rotate-6",
//       url: img2,
//       category: "Adventure",

//     },
//     {
//       id: 3,
//       title: "Study like Pro",
//       views: "300,000+ views",
//       position: "left-[10%] bottom-[15%]",
//       width: "w-56",
//       rotate: "-rotate-6",
//       url: img3,
//       category: "Adventure",

//     },
//     {
//       id: 4,
//       title: "People Are Scared of AI",
//       views: "600,000+ views",
//       position: "right-[12%] top-[8%]",
//       width: "w-64",
//       rotate: "rotate-12",
//       url: img4,
//       category: "Adventure",

//     },
//     {
//       id: 5,
//       title: "Survive In The Wilderness and Win",
//       views: "200,000+ views",
//       position: "right-[32%] top-[35%]",
//       width: "w-72",
//       rotate: "-rotate-6",
//       url: img5,
//       category: "Adventure",

//     },
//     {
//       id: 6,
//       title: "100 Hour Minecraft",
//       views: "400,000+ views",
//       position: "right-[15%] bottom-[20%]",
//       width: "w-56",
//       rotate: "rotate-12",
//       url: img6,
//       category: "Adventure",

//     },
//   ];

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden bg-black">
//       {/* Cool gradient background */}
//       <div className="absolute inset-0">
//         <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,#4F46E5_0%,transparent_50%)] opacity-30" />
//         <div className="absolute w-full h-full bg-[radial-gradient(circle_at_top_right,#EC4899_0%,transparent_50%)] opacity-20" />
//       </div>

//       {/* Main content */}
//       <div className="relative z-10 px-4 sm:px-6 lg:px-8">
//         {/* Hero Text Section */}
//         <div className="text-center pt-20 pb-16 max-w-5xl mx-auto">
//           <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">
//             <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
//               Turn Your Text Into
//             </span>
//             <br />
//             <span className="inline-block mt-2 text-white">Epic Images ✨</span>
//           </h1>
//           <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
//             Join the coolest AI image generation community. No cap fr fr 🔥
//           </p>
//           <div className="mt-10">
//             <Link
//               href="/login"
//               className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-500 hover:to-purple-500 transform transition-all hover:scale-105 hover:shadow-xl"
//             >
//               Get Started — It's Free
//             </Link>
//             <p className="mt-4 text-sm text-gray-400">
//               no cap, no credit card needed rn
//             </p>
//           </div>
//         </div>

//         {/* Thumbnails Grid */}
//         <div className="max-w-7xl mx-auto pb-20">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
//             {thumbnails.map((thumb) => (
//               <div
//                 key={thumb.id}
//                 className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
//               >
//                 <div className="aspect-video relative">
//                   <Image
//                     src={thumb.url}
//                     alt={thumb.title}
//                     fill
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                     loading="lazy"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                   {/* Category Tag */}
//                   <div className="absolute top-4 left-4">
//                     <span className="px-3 py-1 text-xs font-semibold bg-white/10 backdrop-blur-sm rounded-full text-white">
//                       {thumb.category}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="text-white font-bold text-lg leading-tight mb-1">
//                     {thumb.title}
//                   </h3>
//                   <p className="text-gray-400 text-sm">{thumb.views}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModernHeroSection;
