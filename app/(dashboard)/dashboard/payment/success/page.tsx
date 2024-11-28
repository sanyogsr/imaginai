"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { saveAs } from "file-saver";

const PaymentDetails = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("order_id");
  const signature = searchParams.get("signature");

  const truncateText = (text: string, length: number) =>
    text?.length > length ? `${text.slice(0, length)}...` : text;

  const generateInvoice = () => {
    const invoiceData = `
      Payment Invoice
      -------------------------
      Payment ID: ${paymentId}
      Order ID: ${orderId}
      Signature: ${signature}
      -------------------------
      Thank you for your payment!
    `;

    const blob = new Blob([invoiceData], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `Invoice-${orderId}.txt`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-purple-500 via-indigo-500 to-pink-500 p-4">
      <div className="relative bg-white shadow-2xl p-8 rounded-xl max-w-lg w-full overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl"></div>

        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center mb-6">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Thank you for your payment! Your transaction was completed
          successfully.
        </p>

        {/* Transaction Details */}
        <div className="bg-gray-100 p-4 rounded-lg space-y-4 text-sm md:text-base">
          <div className="flex justify-between items-center">
            <span className="font-medium text-purple-600">Payment ID:</span>
            <span className="truncate text-gray-700" title={paymentId || "N/A"}>
              {truncateText(paymentId || "N/A", 24) || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-600">Order ID:</span>
            <span className="truncate text-gray-700" title={orderId || "N/A"}>
              {truncateText(orderId || "N/A", 24) || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-pink-600">Signature:</span>
            <span className="truncate text-gray-700" title={signature || "N/A"}>
              {truncateText(signature || "N/A", 24) || "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={generateInvoice}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 hover:shadow-lg transition-all"
          >
            Download Invoice
          </button>
          <a
            href="/dashboard"
            className="w-full block text-center bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccess = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PaymentDetails />
  </Suspense>
);

export default PaymentSuccess;
