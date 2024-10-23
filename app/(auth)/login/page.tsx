"use client";
import GoogleIcon from "@/assets/google.svg";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import LoginNavbar from "@/components/LoginNavbar";
import LoadingOverlay from "@/components/loader/Loader";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Show loader when the login process starts
    await signIn("google", { callbackUrl: "/dashboard" });
    setLoading(false); // Hide loader (though this line may not execute as page will redirect)
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingOverlay />
        </div>
      )}{" "}
      <div className="flex flex-col h-screen">
        <LoginNavbar />

        <div className="flex-grow flex items-center justify-center bg-gray-100">
          <div className="bg-black rounded-lg h-[15rem] w-[23rem] flex flex-col gap-y-10 p-5">
            <h1 className="text-2xl font-semibold text-white text-center">
              Login
            </h1>
            <button
              onClick={handleLogin}
              className="text-black px-7 py-4 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200"
              disabled={loading}
            >
              <div className="flex items-center gap-3 justify-center">
                <Image
                  src={GoogleIcon}
                  alt="google icon"
                  height={25}
                  width={25}
                />
                <div>Login with Google</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
