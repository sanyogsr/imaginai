import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { imagesDataUrl, createMasks, steps, triggerWord, isStyle } =
      await req.json();

    const { request_id } = await fal.queue.submit(
      "fal-ai/flux-lora-fast-training",
      {
        input: {
          images_data_url: imagesDataUrl,
          create_masks: createMasks,
          steps,
          trigger_word: triggerWord,
          is_style: isStyle,
        },
      }
    );

    return NextResponse.json({ requestId: request_id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Training request failed:", error.message);
    return NextResponse.json(
      { error: "Failed to submit training request" },
      { status: 500 }
    );
  }
}
