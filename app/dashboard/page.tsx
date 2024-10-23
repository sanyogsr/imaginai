"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default function Dashboard ()  {
  const session = useSession();
  if (session.status === "unauthenticated") {
    return redirect("/");
  }
  return (
    <div>
      {JSON.stringify(session)}
      <button
        onClick={() => {
          signOut({ redirectTo: "/" });
        }}
      >
        Sign out
      </button>
    </div>
  );
};

