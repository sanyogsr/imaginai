"use client";

import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import Testimonials from "./Testimonial";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
}
