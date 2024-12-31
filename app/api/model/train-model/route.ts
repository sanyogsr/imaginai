import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const WEBHOOK_URL = "https://www.imaginai.art";
// process.env.SITE_URL ??

// "https://7ce9-2409-40d6-1012-ad1f-ed21-b45b-43b9-8e7b.ngrok-free.app";
export async function POST(req: NextRequest) {
  const { modelName, zipUrl } = await req.json();
  const user = await auth();

  try {
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const modelId = `${user.user?.id}_${Date.now()}_${modelName
      .toLowerCase()
      .replaceAll(" ", "_")}`;
    console.log(modelId);
    // create the model
    await replicate.models.create("suraua", modelId, {
      visibility: "private",
      hardware: "gpu-a100-large",
    });

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        destination: `suraua/${modelId}`,
        input: {
          steps: 1000,
          resolution: "1024",
          input_images: zipUrl,
          trigger_word: "sigma",
        },
        webhook: `${WEBHOOK_URL}/api/model/train-model/webhook?userId=${
          user.user?.id
        }&modelName=${encodeURIComponent(
          modelId
        )}&fileName=${encodeURIComponent(zipUrl)}`,
        webhook_events_filter: ["completed"],
      }
    );
    console.log(training);

    // Save training info to database
    await prisma.training.create({
      data: {
        user_id: user.user?.id,
        training_status: training.status,
        model_name: modelName,
        trigger_word: "sigma",
        training_steps: 1200,
        model_id: modelId,
        training_id: training.id,
      },
    });

    return NextResponse.json({ message: "training started" }, { status: 200 });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
