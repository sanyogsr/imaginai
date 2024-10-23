// import { Twitter } from "lucide-react";
// import Link from "next/link";
// import ScrollingProfileCarousel from "./ImageScroll";
// import SocialShareSection from "./SocialMediaShowcase";
// import Input from "./Input";

// export default function HeroSection() {
//   return (
//     <div className="mt-6 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
//       {/* Hero Card */}
//       <div className="p-3 bg-black flex flex-col rounded-lg w-full max-w-2xl h-[24rem] sm:h-[28rem] justify-center items-center">
//         <div className="bg-white flex-grow mb-2 w-full rounded-lg flex items-center justify-center">
//           <p className="text-black text-lg font-semibold">Image Section</p>
//         </div>
//         <div className="bg-white rounded-lg h-10 w-full flex items-center  px-2">
//           <button className="bg-gray-200 px-2 py-1 rounded-md">Model</button>
//           <div className="text-black flex flex-grow ml-2">
//             <Input />
//           </div>
//           <div className="text-black ml-2 ">
//             <button className="bg-black py-1 px-2 text-white rounded-lg hover:scale-105">
//               Generate
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Scrolling Carousel */}
//       <div className="mt-10 w-full flex flex-col items-center px-4 md:px-8">
//         <div className="text-center font-serif font-bold text-3xl md:text-5xl leading-snug max-w-4xl space-y-6">
//           <p>
//             Turn your ideas into{" "}
//             <span className="text-indigo-600">stunning visuals </span>
//             with <span className="text-pink-500">AI</span>.
//           </p>
//           <p className="text-gray-700 text-xl md:text-2xl">
//             Ready for instant social sharing with just a click.
//           </p>
//         </div>

//         <div className="mt-2 w-full max-w-5xl">
//           <ScrollingProfileCarousel />
//         </div>
//       </div>
//       <div className="text-4xl mt-10 font-light max-w-lg text-center">
//         Try and share your <span className="text-indigo-600">imagination</span>{" "}
//         on social media
//       </div>

//       <SocialShareSection />
//     </div>
//   );
// }

// export function TwitterIcon() {
//   return (
//     <div className="hidden lg:fixed bottom-10 right-10">
//       <Link href="https://www.x.com/sanyogsr" target="_blank">
//         <div className="bg-black p-2 rounded-full text-white hover:bg-gray-800">
//           <Twitter className="text-blue-500" />
//         </div>
//       </Link>
//     </div>
//   );
// }

// components/HeroSection.tsx
import React from "react";
import HeroCard from "./HeroCard";
import ScrollingProfileCarousel from "./ImageScroll";
import SocialShareSection from "./SocialMediaShowcase";

const HeroSection: React.FC = () => {
  return (
    <div className="mt-6 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
      <HeroCard />

      {/* Scrolling Carousel */}
      <div className="mt-10 w-full flex flex-col items-center px-4 md:px-8">
        <div className="text-center font-serif font-bold text-3xl md:text-5xl leading-snug max-w-4xl space-y-6">
          <p>
            Turn your ideas into{" "}
            <span className="text-indigo-600">stunning visuals </span>
            with <span className="text-pink-500">AI</span>.
          </p>
          <p className="text-gray-700 text-xl md:text-2xl">
            Ready for instant social sharing with just a click.
          </p>
        </div>

        <div className="mt-2 w-full max-w-5xl">
          <ScrollingProfileCarousel />
        </div>
      </div>
      <div className="text-4xl mt-10 font-light max-w-lg text-center">
        Try and share your <span className="text-indigo-600">imagination</span>{" "}
        on social media
      </div>

      <SocialShareSection />
    </div>
  );
};

export default HeroSection;
