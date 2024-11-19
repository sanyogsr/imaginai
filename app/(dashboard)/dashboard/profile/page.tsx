"use client";
import React, { useState, useEffect } from "react";
import { Camera, CreditCard, Download, ChevronDown, X } from "lucide-react";
import { Progress } from "@/components/ProgressBar";
import { userCreditsStore } from "@/store/useCreditStore";
import {  useSession } from "next-auth/react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import UpiIcon from "@/assets/upi-icon.png";
interface Payment {
  id: string;
  userId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethodsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Payment Methods</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="text-blue-600" size={20} />
            </div>
            <span className="font-medium">Credit/Debit Cards</span>
          </div>
          <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors">
            <div className="w-10 h-10  flex items-center justify-center">
              <Image src={UpiIcon} alt="UPI" width={40} height={40} />
            </div>
            <span className="font-medium">UPI Payment</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface BillingHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: Payment[];
  loading: boolean;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({
  open,
  onOpenChange,
  payments,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:w-[32rem]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Billing History</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {payment.currency} {Number(payment.amount).toFixed(2)}
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                        payment.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-300 text-green-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex justify-between items-center">
                    <span>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: {payment.razorpayPaymentId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payment history found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProfilePage: React.FC = () => {
  const session = useSession();
  const { credits, fetchCredits } = userCreditsStore();
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchCredits();
  }, [credits]);
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payment-history");
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-black/10 shadow-sm">
          <div className="flex items-start gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-400 to-pink-500 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <Image
                    src={session.data?.user?.image ?? "/default-avatar.png"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-lg shadow-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {session?.data?.user?.name}
                  </h1>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{session?.data?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-black/10 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">My credits</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">
                  AI generation credits
                </span>
                <span className="text-sm font-medium">
                  {credits ?? 0} / 500
                </span>
              </div>
              <Progress value={credits ?? 0} variant="gradient" size="md" />
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="border rounded-2xl border-black/10 shadow-sm">
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-6">Billing</h2>
            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setShowPaymentMethods(true)}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="text-gray-500" size={20} />
                  <div className="text-left">
                    <div className="font-medium">Payment Methods</div>
                    <div className="text-sm text-gray-500">
                      Manage your payment options
                    </div>
                  </div>
                </div>
                <ChevronDown className="text-gray-500" size={20} />
              </button>

              <button
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowBillingHistory(true);
                  fetchPaymentHistory();
                }}
              >
                <div className="flex items-center gap-3">
                  <Download className="text-gray-500" size={20} />
                  <div className="text-left">
                    <div className="font-medium">Billing History</div>
                    <div className="text-sm text-gray-500">
                      View past transactions
                    </div>
                  </div>
                </div>
                <ChevronDown className="text-gray-500" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentMethods
        open={showPaymentMethods}
        onOpenChange={setShowPaymentMethods}
      />

      <BillingHistory
        open={showBillingHistory}
        onOpenChange={setShowBillingHistory}
        payments={paymentHistory}
        loading={loading}
      />
    </div>
  );
};

export default ProfilePage;
