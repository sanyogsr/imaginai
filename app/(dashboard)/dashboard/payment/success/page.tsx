"use client";
import React from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();

  //   useEffect(() => {
  //     // Retrieve payment details from localStorage
  //     const storedDetails = localStorage.getItem("paymentDetails");

  //     if (storedDetails) {
  //       setPaymentDetails(JSON.parse(storedDetails));
  //       // Clear the stored details to prevent re-showing on refresh
  //       //   localStorage.removeItem("paymentDetails");
  //     } else {
  //       // If no payment details, redirect back to pricing page
  //       router.push("/dashboard");
  //     }
  //   }, [router]);

  //   if (!paymentDetails) {
  //     return null;
  //   }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="bg-green-100 rounded-full p-4 inline-block mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
