"use client";
import React, { useState, useEffect } from "react";
import { Check, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = () => {
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId: string;
    planName: string;
    credits: number;
    amount: number;
    paymentId: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve payment details from localStorage
    const storedDetails = localStorage.getItem("paymentDetails");

    if (storedDetails) {
      setPaymentDetails(JSON.parse(storedDetails));
      // Clear the stored details to prevent re-showing on refresh
      //   localStorage.removeItem("paymentDetails");
    } else {
      // If no payment details, redirect back to pricing page
      router.push("/dashboard");
    }
  }, [router]);

  if (!paymentDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="bg-green-100 rounded-full p-4 inline-block mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Plan:</span>
            <span className="font-semibold">{paymentDetails.planName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Credits:</span>
            <span className="font-semibold">{paymentDetails.credits}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-semibold">₹{paymentDetails.amount}</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-gray-600" />
              <span className="text-gray-600">Payment ID:</span>
            </div>
            <span className="font-mono text-sm text-gray-800">
              {paymentDetails.paymentId}
            </span>
          </div>
        </div>

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
