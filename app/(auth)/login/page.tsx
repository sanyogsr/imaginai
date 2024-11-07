// login.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import GoogleIcon from "@/assets/google.svg";
import LoginNavbar from "@/components/LoginNavbar";
import LoadingOverlay from "@/components/loader/Loader";
import { AnimatedContainer } from "@/components/AnimatedContainer";

interface LoadingState {
  isLoading: boolean;
  message: string;
}

export default function Login() {
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    message: "",
  });

  const handleLogin = async () => {
    setLoading({ isLoading: true, message: "Connecting to Google..." });
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setLoading({ isLoading: false, message: error as string });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <LoginNavbar />

      {loading.isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <LoadingOverlay />
            <p className="text-sm text-white">{loading.message}</p>
          </div>
        </div>
      ) : null}

      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <AnimatedContainer variant="glass" className="w-full max-w-md">
          <div className="p-8 space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter text-gray-900 ">
                Welcome Back
              </h1>
              <p className="text-gray-500 ">
                Sign in to continue to your dashboard
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full group relative"
              disabled={loading.isLoading}
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 rounded-xl opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative h-14 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center gap-3 px-6 text-gray-900 dark:text-white font-medium transition-transform duration-300 group-hover:scale-[0.99]">
                <Image
                  src={GoogleIcon}
                  alt="Google"
                  height={24}
                  width={24}
                  className="w-6 h-6"
                />
                <span>Continue with Google</span>
              </div>
            </button>
          </div>
        </AnimatedContainer>
      </main>
    </div>
  );
}
