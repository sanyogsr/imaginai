import { auth } from "@/auth";

import LandingPage from "@/components/LandingPage";
import { redirect } from "next/navigation";
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});
export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
    // return null;
  }

  return <LandingPage />;
}
