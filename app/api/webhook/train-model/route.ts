import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const status = await fal.queue.status("fal-ai/flux-lora-fast-training", {
      requestId,
      logs: true,
    });

    return NextResponse.json(status);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to fetch status:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch training status" },
      { status: 500 }
    );
  }
}
