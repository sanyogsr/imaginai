// import { NextRequest, NextResponse } from "next/server";
// import Replicate from "replicate";

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });
// export async function POST(req: NextRequest) {
//   const reqData = await req.json();

//   try {
//     const training = await replicate.trainings.create(
//       "ostris",
//       "flux-dev-lora-trainer",
//       "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
//       {
//         // You need to create a model on Replicate that will be the destination for the trained version.
//         destination: `sanyogsr/${reqData.modelName}`,
//         input: {
//           steps: 1000,
//           lora_rank: 16,
//           optimizer: "adamw8bit",
//           batch_size: 1,
//           resolution: "512,768,1024",
//           autocaption: true,
//           input_images: reqData.images,
//           trigger_word: "joker",
//           learning_rate: 0.0004,
//           wandb_project: "flux_train_replicate",
//           wandb_save_interval: 100,
//           caption_dropout_rate: 0.05,
//           cache_latents_to_disk: false,
//           wandb_sample_interval: 100,
//         },
//       }
//     );

//     return NextResponse.json(
//       { message: "training successful", training },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("error:", error);
//     return NextResponse.json(
//       { message: "internal server error" },
//       { status: 500 }
//     );
//   }
// }

// pages/api/train.ts
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { prisma } from "@/utils/prisma";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  const { modelName, zipUrl } = await req.json();

  try {
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
      {
        destination: `sanyogsr/${modelName}`,
        input: {
          steps: 1000,
          lora_rank: 16,
          optimizer: "adamw8bit",
          batch_size: 1,
          resolution: "512,768,1024",
          autocaption: true,
          input_images: zipUrl,
          trigger_word: "joker",
          learning_rate: 0.0004,
          wandb_project: "flux_train_replicate",
          wandb_save_interval: 100,
          caption_dropout_rate: 0.05,
          cache_latents_to_disk: false,
          wandb_sample_interval: 100,
        },
      }
    );

    // Save training info to database
    await prisma.training.create({
      data: {
        id: training.id,
        modelName: modelName,
        status: "training",
        modelUrl: training.urls,
      },
    });

    return NextResponse.json(
      { message: "training started", training },
      { status: 200 }
    );
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
