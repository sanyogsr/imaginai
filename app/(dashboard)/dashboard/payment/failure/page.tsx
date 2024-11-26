"use client";
import React from "react";
import { X, RefreshCw, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentFailurePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="bg-red-100 rounded-full p-4 inline-block mb-6">
          <X className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>

        <p className="text-gray-600 mb-6">
          We couldn&apos;t process your payment. Please try again or contact support.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => router.push("/dashboard/upgrade")}
            className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push("/dashboard/support")}
            className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
