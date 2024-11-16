"use client";
import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Wand2,
  Palette,
  Camera,
  PenTool,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const plans = [
    {
      name: "Creative Explorer",
      price: isAnnual ? 50 : 60,
      features: [
        "60 AI masterpiece generations",
        "HD quality artworks",
        "Basic style controls",
        "24/7 creative support",
        "Commercial usage rights",
      ],
      cta: "Start Creating",
      popular: false,
      icon: <Palette className="w-8 h-8 text-purple-400" />,
    },
    {
      name: "Artist Pro",
      price: isAnnual ? 190 : 200,
      features: [
        "300 AI masterpiece generations",
        "Ultra HD quality artworks",
        "Advanced style & mood controls",
        "Priority creative support",
        "Commercial usage rights",
        "Style preservation technology",
      ],
      cta: "Unleash Creativity",
      popular: true,
      icon: <Wand2 className="w-8 h-8 text-purple-500" />,
    },
    {
      name: "Studio Master",
      price: isAnnual ? 380 : 400,
      features: [
        "700 AI masterpiece generations",
        "Maximum resolution artworks",
        "Custom style engine access",
        "Dedicated art director",
        "Advanced API integration",
        "Exclusive artistic features",
        "Team collaboration tools",
      ],
      cta: "Master Your Craft",
      popular: false,
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
    },
  ];

  const features = [
    {
      icon: <Camera className="w-12 h-12 text-purple-500" />,
      title: "AI-Powered Creation",
      description:
        "Transform your ideas into stunning visuals with our state-of-the-art AI models",
    },
    {
      icon: <PenTool className="w-12 h-12 text-purple-500" />,
      title: "Style Control",
      description:
        "Fine-tune every aspect of your artwork with intuitive style controls",
    },
    {
      icon: <Layers className="w-12 h-12 text-purple-500" />,
      title: "Commercial License",
      description:
        "Use your generated masterpieces in commercial projects worry-free",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4">
                Where AI Meets Artistry
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of creators transforming ideas into stunning
                artworks
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm ${
                  !isAnnual ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-16 h-8 flex items-center bg-purple-100 rounded-full p-1 cursor-pointer"
              >
                <div
                  className={`absolute w-6 h-6 bg-purple-600 rounded-full shadow-lg transform transition-transform duration-300 ease-spring ${
                    isAnnual ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  isAnnual ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Annually
                <span className="ml-1 text-green-500 font-medium">
                  (Save 20%)
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular
                    ? "ring-2 ring-purple-500 transform scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 text-sm font-medium rounded-bl-2xl">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    {plan.icon}
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => router.push("/login")}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transform hover:-translate-y-1"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-24 text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 max-w-4xl mx-auto shadow-xl">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Creative Journey?
              </h2>
              <p className="text-gray-600 mb-8">
                Join our community of artists and creators. Start generating
                stunning AI artwork today.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:opacity-90 transform hover:-translate-y-1"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
