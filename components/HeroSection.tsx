import React from "react";
import HeroCard from "./HeroCard";
import ScrollingProfileCarousel from "./ImageScroll";
import SocialShareSection from "./SocialMediaShowcase";

const HeroSection: React.FC = () => {
  return (
    <div className="mt-6 flex flex-col items-center w-full px-2 sm:px-6 lg:px-8">
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
