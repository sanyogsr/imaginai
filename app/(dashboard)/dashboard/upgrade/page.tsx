// "use client";
// import React, { useState } from "react";
// import { Check, Sparkles, Zap } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Script from "next/script";
// declare global {
//   interface Window {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     Razorpay: any;
//   }
// }

// const PricingPage = () => {
//   const [isAnnual, setIsAnnual] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const session = useSession();
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handlePayment = async (plan: any) => {
//     setIsProcessing(true);
//     try {
//       const response = await fetch("/api/create-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ price: plan.price, credits: plan.credits }),
//       });
//       const data = await response.json();

//       if (!data.orderId) {
//         throw new Error("Order ID is missing from the response.");
//       }

//       const options = {
//         key: process.env.RAZORPAY_KEY_ID, // Use the public key here
//         amount: plan.price * 400,
//         currency: "INR",
//         name: "Imagin Ai",
//         description: "Your company name",
//         order_id: data.orderId,
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         handler: function (response: any) {
//           console.log("Payment successful", response);
//         },
//         prefill: {
//           name: session.data?.user?.name,
//           email: session.data?.user?.email,
//           contact: "",
//         },
//         notes: {
//           user_id: session.data?.user?.id, // Replace 'USER_ID' with the actual user ID you want to pass
//         },
//         theme: "#3399cc",
//       };
//       const rzp1 = new window.Razorpay(options);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       rzp1.on("payment.failed", function (response: any) {
//         console.error("Payment failed", response.error);
//       });

//       rzp1.open();
//     } catch (error) {
//       console.error("Error initializing Razorpay:", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const plans = [
//     {
//       name: "Hobby",
//       price: isAnnual ? 1 : 1,
//       features: [
//         "150 AI image generations ",

//         "Best resolution images",
//         "24/7 email support",
//       ],
//       credits: 300,
//       cta: "Get Started",
//       popular: false,
//     },
//     {
//       name: "Pro",
//       price: isAnnual ? 190 : 200,
//       credits: 700,

//       features: [
//         "350 AI image generations",
//         "Advanced style controls",
//         "Best resolution images",
//       ],
//       cta: "Get Started",
//       popular: false,
//     },
//     {
//       name: "Value for money",
//       price: isAnnual ? 380 : 400,
//       credits: 1600,

//       features: [
//         "800 AI image generation",
//         "Dedicated account manager",
//         "Best resolution images",
//         "White-label options",
//         "Custom API integration",
//         "SSO & team management",
//       ],
//       cta: "Upgraded to pro",
//       popular: true,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-20 px-4">
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         strategy="afterInteractive"
//       />
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Upgrade Your Creative Power
//           </h1>
//           <p className="text-lg text-gray-600 mb-8">
//             Choose the perfect plan for your creative journey
//           </p>

//           {/* Billing Toggle */}
//           <div className="flex items-center justify-center gap-4">
//             <span
//               className={`text-sm ${
//                 !isAnnual ? "text-gray-900" : "text-gray-500"
//               }`}
//             >
//               Monthly
//             </span>
//             <button
//               onClick={() => setIsAnnual(!isAnnual)}
//               className="relative w-16 h-8 flex items-center bg-purple-100 rounded-full p-1 overflow-hidden transition-colors duration-200 ease-in-out"
//             >
//               <div
//                 className={`absolute w-6 h-6 bg-purple-600 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
//                   isAnnual ? "translate-x-8" : "translate-x-0"
//                 }`}
//               />
//             </button>
//             <span
//               className={`text-sm ${
//                 isAnnual ? "text-gray-900" : "text-gray-500"
//               }`}
//             >
//               Annually
//               <span className="ml-1 text-green-500 text-xs font-medium">
//                 Save 20%
//               </span>
//             </span>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {plans.map((plan) => (
//             <div
//               key={plan.name}
//               className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
//                 plan.popular ? "ring-2 ring-purple-500" : ""
//               }`}
//             >
//               {plan.popular && (
//                 <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-xl">
//                   Most Popular
//                 </div>
//               )}

//               <div className="p-8">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                   {plan.name}
//                 </h3>
//                 <div className="flex items-baseline mb-6">
//                   <span className="text-4xl font-bold text-gray-900">
//                     ₹{plan.price}
//                   </span>
//                   <span className="text-gray-500 ml-1">/month</span>
//                 </div>

//                 <ul className="space-y-4 mb-8">
//                   {plan.features.map((feature) => (
//                     <li key={feature} className="flex items-center gap-3">
//                       <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
//                       <span className="text-gray-600">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <button
//                   onClick={() => handlePayment(plan)}
//                   disabled={isProcessing}
//                   className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
//                     plan.popular
//                       ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
//                       : "bg-gray-100 text-gray-900 hover:bg-gray-200"
//                   }`}
//                 >
//                   {plan.cta}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Features Grid */}
//         <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <div className="text-center p-6">
//             <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">AI-Powered Creation</h3>
//             <p className="text-gray-600">
//               Create stunning images with state-of-the-art AI models
//             </p>
//           </div>
//           <div className="text-center p-6">
//             <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
//             <p className="text-gray-600">
//               Generate images in seconds with our optimized infrastructure
//             </p>
//           </div>
//           <div className="text-center p-6">
//             <Check className="w-12 h-12 text-purple-500 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Commercial License</h3>
//             <p className="text-gray-600">
//               Use generated images in your commercial projects worry-free
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPage;
"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import Script from "next/script";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const session = useSession();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: plan.price, credits: plan.credits }),
      });
      const data = await response.json();

      if (!data.orderId) {
        throw new Error("Order ID is missing from the response.");
      }

      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Use the public key here
        amount: plan.price * 400,
        currency: "INR",
        name: "Imagin Ai",
        description: "Your company name",
        order_id: data.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: function (response: any) {
          console.log("Payment successful", response);
        },
        prefill: {
          name: session.data?.user?.name || "sholey gupta",
          email: session.data?.user?.email || "example@gmail.com",
          contact: phoneNumber, // Use the collected phone number
        },
        notes: {
          user_id: session.data?.user?.id,
        },
        theme: "#3399cc",
      };
      const rzp1 = new window.Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp1.on("payment.failed", function (response: any) {
        console.error("Payment failed", response.error);
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
      name: "Hobby",
      price: isAnnual ? 1 : 1,
      features: [
        "150 AI image generations ",
        "Best resolution images",
        "24/7 email support",
      ],
      credits: 300,
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: isAnnual ? 190 : 200,
      credits: 700,
      features: [
        "350 AI image generations",
        "Advanced style controls",
        "Best resolution images",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Value for money",
      price: isAnnual ? 380 : 400,
      credits: 1600,
      features: [
        "800 AI image generation",
        "Dedicated account manager",
        "Best resolution images",
        "White-label options",
        "Custom API integration",
        "SSO & team management",
      ],
      cta: "Upgraded to pro",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
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

          {/* Phone Number Input */}
          <div className="mt-6">
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md"
            />
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
                    ₹{plan.price}
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
                  onClick={() => handlePayment(plan)}
                  disabled={isProcessing}
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
      </div>
    </div>
  );
};

export default PricingPage;
