"use client";
import React from "react";
import { Camera, Edit2, CreditCard, Download } from "lucide-react";
import { Progress } from "@/components/ProgressBar";
import { userCreditsStore } from "@/store/useCreditStore";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const session = useSession();
  const { credits } = userCreditsStore();
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto ">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 border  border-black relative">
          <div className="flex items-start gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden">
                <img
                  src="/api/placeholder/150/150"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-purple-500 p-2 rounded-lg shadow-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {session?.data?.user?.name}
                </h1>
                <button className="text-gray-500 hover:text-gray-700">
                  <Edit2 size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                {session?.data?.user?.email}{" "}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl p-8 mb-8 border  border-black">
          <h2 className="text-lg font-semibold mb-6">My credits</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">
                  AI generation credits
                </span>
                <span className="text-sm font-medium">
                  {credits ? credits : 0} / 500
                </span>
              </div>
              <Progress
                value={credits ? credits : 0}
                variant="gradient"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className=" border rounded-lg border-black">
          {/* <div className="bg-white rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Key className="text-gray-500" size={20} />
                <div className="text-left">
                  <div className="font-medium">Password & Security</div>
                  <div className="text-sm text-gray-500">
                    Manage your password and 2FA
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Bell className="text-gray-500" size={20} />
                <div className="text-left">
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-gray-500">
                    Configure email notifications
                  </div>
                </div>
              </button>
            </div>
          </div> */}

          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-lg font-semibold mb-6">Billing</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <CreditCard className="text-gray-500" size={20} />
                <div className="text-left">
                  <div className="font-medium">Payment Methods</div>
                  <div className="text-sm text-gray-500">
                    Manage your payment options
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Download className="text-gray-500" size={20} />
                <div className="text-left">
                  <div className="font-medium">Billing History</div>
                  <div className="text-sm text-gray-500">
                    Download past invoices
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
