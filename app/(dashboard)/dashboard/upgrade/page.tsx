"use client";
import React, { useState } from "react";
import { Check, Sparkles, Wand2, Palette } from "lucide-react";
import { useSession } from "next-auth/react";
import Script from "next/script";
// import {  useRouter } from "next/navigation";

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
  // const router = useRouter();
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
        key: process.env.RAZORPAY_KEY_TEST,
        amount: plan.price * 100,
        currency: "INR",
        name: "Imagin AI",
        description: `${plan.name} Plan - ${plan.credits} Credits`,
        order_id: data.orderId,
        // callback_url: `https://imaginai.art/api/razorpay/callback`,
        // redirect: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          console.log("[INFO] Razorpay Payment Successful:", response);

          // Step 3: Send payment verification to backend
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert("Payment Verified and Successful!");
            // Redirect or update UI
          } else {
            alert("Payment Verification Failed");
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // handler: async function (response: any) {
        //   // Send user to success page with query params

        //   const data1 = {
        //     orderCreationId: data.orderId,
        //     razorpayPaymentId: response.razorpay_payment_id,
        //     razorpayOrderId: response.razorpay_order_id,
        //     razorpaySignature: response.razorpay_signature,
        //   };
        //   const verifyResponse = await fetch("/api/verify-payment", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data1),
        //   });
        //   const res = await verifyResponse.json();
        //   if (res.isOk)
        //     router.push(
        //       `/dashboard/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&signature=${response.razorpay_signature}`
        //     );
        //   else {
        //     router.push("/dashboard/payment/failure");
        //   }

        //   // const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        //   //   response;
        //   // router.push(
        //   //   `/dashboard/payment/success?payment_id=${razorpay_payment_id}&order_id=${razorpay_order_id}&signature=${razorpay_signature}`
        //   // );
        // },

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
        // redirect("https://imaginai/art/dashboard/payment/failure");

        alert("refresh the pageto see the added credits");
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
      name: "ultra standard",
      price: session.data?.user?.id === "cm3ivcppq0000t0ut2yadv8vr" ? 1 : 2,
      credits: session.data?.user?.id === "cm3ivcppq0000t0ut2yadv8vr" ? 2 : 2,
      features: [
        "1 Flux Schnell images",
        "best quality artworks",
        "Basic style controls",
        "24/7 email support",
        "Commercial usage rights",
      ],
      cta: "Get Started",
      popular: false,
      icon: <Palette className="w-8 h-8 text-purple-400" />,
    },
    {
      name: "standard",
      price: session.data?.user?.id === "cm3ivcppq0000t0ut2yadv8vr" ? 1 : 89,
      credits: session.data?.user?.id === "cm3ivcppq0000t0ut2yadv8vr" ? 2 : 120,
      features: [
        "60 Flux Schnell images",
        "or 5 Flux pro v1.1 images",
        "best quality artworks",
        "Basic style controls",
        "24/7 email support",
        "Commercial usage rights",
      ],
      cta: "Get Started",
      popular: false,
      icon: <Palette className="w-8 h-8 text-purple-400" />,
    },
    {
      name: "Pro",
      price: 199,
      credits: 420,
      features: [
        "210 FLux Schnell images",
        "best quality artworks",
        "24/7 email support",
        "New Feature Access: Early",
        "Commercial usage rights",
        "zero downtime",
      ],
      cta: "Get Started",
      popular: true,
      icon: <Wand2 className="w-8 h-8 text-purple-500" />,
    },
    {
      name: "Creators choice",
      price: 399,
      credits: 900,
      features: [
        "450 FLux Schnell images",
        "Commercial usage rights",
        "New Feature Access: Early",
        " Priority creative support",
        "zero downtime  ",
      ],
      cta: "Get Started",
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
                  {/* <span className="text-gray-500 ml-2">/month</span> */}
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
