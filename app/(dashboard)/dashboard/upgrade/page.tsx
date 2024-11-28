"use client";
import React, { useState } from "react";
import { Check, Sparkles, Wand2, Palette } from "lucide-react";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const PricingPage = () => {
  // const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const session = useSession();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePayment = async (plan: any) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: plan.price, credits: plan.credits }),
      });
      const data = await response.json();

      if (!data.orderId)
        throw new Error("Order ID is missing from the response.");

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: "INR",
        name: "Imagin AI",
        description: `${plan.name} Plan - ${plan.credits} Credits`,
        order_id: data.orderId,
        callback_url: `${process.env.NEXTAUTH_URL}/api/razorpay_callback`,
        redirect: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: function () {
          console.log("payment successfully");

          // Redirect to a success page
          // router.push("/dashboard/payment/success");
        },
        prefill: {
          name: session.data?.user?.name || "",
          email: session.data?.user?.email || "",
          contact: phoneNumber,
        },
        notes: { user_id: session.data?.user?.id },
        theme: { color: "#8B5CF6" },
      };

      const rzp1 = new window.Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp1.on("payment.failed", function (response: any) {
        console.error("Payment failed", response.error);
        router.push("/dashboard/payment/failure");
      });
      rzp1.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    {
      name: "Creative Explorer",
      price: session.data?.user?.id === "cm37fw1by0000sjnf3v87agtv" ? 1 : 60,
      credits: session.data?.user?.id === "cm37fw1by0000sjnf3v87agtv" ? 1 : 120,
      features: [
        "60 AI masterpiece generations",
        "best quality artworks",
        "Basic style controls",
        "24/7 email support",
        "Commercial usage rights",
      ],
      cta: "Start Creating",
      popular: false,
      icon: <Palette className="w-8 h-8 text-purple-400" />,
    },
    {
      name: "Artist Pro",
      price: 200,
      credits: 500,
      features: [
        "250 AI masterpiece generations",
        "best quality artworks",
        "24/7 email support",
        "Priority creative support",
        "Commercial usage rights",
        "zero downtime",
      ],
      cta: "Unleash Creativity",
      popular: true,
      icon: <Wand2 className="w-8 h-8 text-purple-500" />,
    },
    {
      name: "Studio Master",
      price: 400,
      credits: 1000,
      features: [
        "500 AI masterpiece generations",
        "Maximum resolution artworks",
        "Commercial usage rights",
        "Ultra fast generation",
        " Priority creative support",
        "zero downtime  ",
      ],
      cta: "Master Your Craft",
      popular: false,
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50 py-20 px-4">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4">
              Transform Your Imagination
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock the power of AI to bring your artistic visions to life
            </p>
          </div>

          {/* <div className="flex items-center justify-center gap-4 mb-8">
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
          </div> */}

          <div className="max-w-md mx-auto">
            <input
              type="tel"
              placeholder="Enter your phone number to complete payment"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 border border-purple-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular ? "ring-2 ring-purple-500 transform scale-105" : ""
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
                  onClick={() => handlePayment(plan)}
                  disabled={isProcessing}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transform hover:-translate-y-1"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  {isProcessing ? "Processing..." : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
