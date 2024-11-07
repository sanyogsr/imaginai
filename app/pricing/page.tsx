"use client";
import React, { useState } from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Hobby",
      price: isAnnual ? 29 : 39,
      features: [
        "100 AI generations per month",
        "Basic style customization",
        "Standard resolution images",
        "24/7 email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: isAnnual ? 79 : 89,
      features: [
        "Unlimited AI generations",
        "Advanced style controls",
        "HD resolution images",
        "Priority support",
        "Commercial usage rights",
        "API access",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: isAnnual ? 199 : 249,
      features: [
        "Custom AI model training",
        "Dedicated account manager",
        "4K resolution images",
        "White-label options",
        "Custom API integration",
        "SSO & team management",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upgrade Your Creative Power
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Choose the perfect plan for your creative journey
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm ${
                  !isAnnual ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Monthly
              </span>

              {/* Updated toggle button */}
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-16 h-8 flex items-center bg-purple-100 rounded-full p-1 overflow-hidden transition-colors duration-200 ease-in-out"
              >
                <div
                  className={`absolute w-6 h-6 bg-purple-600 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
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
                <span className="ml-1 text-green-500 text-xs font-medium">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? "ring-2 ring-purple-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-xl">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">/month</span>
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
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
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
            <div className="text-center p-6">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                AI-Powered Creation
              </h3>
              <p className="text-gray-600">
                Create stunning images with state-of-the-art AI models
              </p>
            </div>
            <div className="text-center p-6">
              <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate images in seconds with our optimized infrastructure
              </p>
            </div>
            <div className="text-center p-6">
              <Check className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Commercial License</h3>
              <p className="text-gray-600">
                Use generated images in your commercial projects worry-free
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
