// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { prisma } from "@/utils/prisma";
// import { nanoid } from "nanoid";

// // S3 Client Configuration
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// const bucketName = process.env.AWS_BUCKET_NAME!;

// // Webhook payload validation schema
// const WebhookPayloadSchema = z.object({
//   request_id: z.string(),
//   status: z.enum(["COMPLETED", "IN_PROGRESS", "FAILED"]),
//   result: z
//     .object({
//       data: z
//         .object({
//           video: z
//             .object({
//               url: z.string(),
//               file_name: z.string().optional(),
//               file_size: z.number().optional(),
//               content_type: z.string().optional(),
//             })
//             .optional(),
//         })
//         .optional(),
//     })
//     .optional(),
//   error: z.string().optional(),

//   // Additional metadata you might want to pass
//   prompt: z.string().optional(),
//   userId: z.string().optional(),
//   model: z.string().optional(),
//   duration: z.string().optional(),
//   aspectRatio: z.string().optional(),
// });

// async function uploadVideoToS3(
//   inputVideoUrl: string,
//   metadata: {
//     userId?: string;
//     prompt?: string;
//     model?: string;
//     duration?: string;
//     aspectRatio?: string;
//   }
// ) {
//   try {
//     // Fetch the video from the provided URL
//     const videoResponse = await fetch(inputVideoUrl);
//     const videoBlob = await videoResponse.blob();
//     const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());

//     // Generate unique ID for the video
//     const videoId = nanoid();

//     // Define the file key with a videos folder
//     const fileKey = `generated/videos/${videoId}.mp4`;

//     // Upload to S3
//     const command = new PutObjectCommand({
//       Bucket: bucketName,
//       Key: fileKey,
//       Body: videoBuffer,
//       ContentType: "video/mp4",
//     });

//     await s3.send(command);

//     // Generate CloudFront URL
//     const cloudFrontUrl = `https://d17d8sfx13z6g2.cloudfront.net/${fileKey}`;

//     // Save to database
//     const savedContent = await prisma.generatedContent.create({
//       data: {
//         userId: metadata.userId,
//         type: "VIDEO",
//         status: "COMPLETED",
//         prompt: metadata.prompt,
//         model: metadata.model || "fal-ai/kling-video/v1.5/pro",
//         outputUrls: [cloudFrontUrl],
//         creditsUsed: 10, // Default credit cost
//         metadata: JSON.stringify({
//           duration: metadata.duration || "5",
//           aspectRatio: metadata.aspectRatio || "16:9",
//         }),
//       },
//     });

//     return {
//       message: "Video uploaded successfully",
//       url: cloudFrontUrl,
//       contentId: savedContent.id,
//     };
//   } catch (error) {
//     console.error("Error uploading video:", error);
//     throw error;
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const payload = await req.json();

//     // Validate webhook payload
//     const validatedPayload = WebhookPayloadSchema.parse(payload);

//     switch (validatedPayload.status) {
//       case "COMPLETED":
//         // Handle successful video generation
//         const videoUrl = validatedPayload.result?.data?.video?.url;

//         if (!videoUrl) {
//           console.error("No video URL found in the payload");
//           return NextResponse.json(
//             { error: "No video URL found" },
//             { status: 400 }
//           );
//         }

//         // Upload video to S3 and save to database
//         const uploadResult = await uploadVideoToS3(videoUrl, {
//           userId: validatedPayload.userId,
//           prompt: validatedPayload.prompt,
//           model: validatedPayload.model,
//           duration: validatedPayload.duration,
//           aspectRatio: validatedPayload.aspectRatio,
//         });

//         console.log(`Video generated and uploaded: ${uploadResult.url}`);

//         return NextResponse.json(uploadResult, { status: 200 });

//       case "IN_PROGRESS":
//         // Optionally log progress
//         console.log(
//           `Video generation in progress: ${validatedPayload.request_id}`
//         );
//         break;

//       case "FAILED":
//         // Handle generation failure
//         console.error(`Video generation failed: ${validatedPayload.error}`);
//         break;
//     }

//     return NextResponse.json(
//       {
//         message: "Webhook processed successfully",
//         status: validatedPayload.status,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Webhook processing error:", error);

//     return NextResponse.json(
//       {
//         message: "Invalid webhook payload",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 400 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/utils/prisma";
import { nanoid } from "nanoid";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

// S3 Client Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME!;

// Webhook payload validation schema
const WebhookPayloadSchema = z.object({
  request_id: z.string(),
  status: z.enum(["COMPLETED", "IN_PROGRESS", "FAILED"]),
  result: z
    .object({
      data: z
        .object({
          video: z
            .object({
              url: z.string(),
              file_name: z.string().optional(),
              file_size: z.number().optional(),
              content_type: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  error: z.string().optional(),

  // Additional metadata you might want to pass
  prompt: z.string().optional(),
  userId: z.string().optional(),
  model: z.string().optional(),
  duration: z.string().optional(),
  aspectRatio: z.string().optional(),
});

async function uploadVideoToS3(
  inputVideoUrl: string,
  metadata: {
    userId: string | null;
    prompt: string;
    model?: string;
    duration?: string;
    aspectRatio?: string;
  }
) {
  try {
    // Fetch the video from the provided URL
    const videoResponse = await fetch(inputVideoUrl);
    const videoBlob = await videoResponse.blob();
    const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());

    // Generate unique ID for the video
    const videoId = nanoid();

    // Define the file key with a videos folder
    const fileKey = `generated/videos/${videoId}.mp4`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: videoBuffer,
      ContentType: "video/mp4",
    });

    await s3.send(command);

    // Generate CloudFront URL
    const cloudFrontUrl = `https://d17d8sfx13z6g2.cloudfront.net/${fileKey}`;
    const session = await auth();

    // Prepare data for Prisma create with correct user connection
    const createData: Prisma.GeneratedContentCreateInput = {
      user: {
        connect: {
          id: session?.user?.id, // Connect to existing user by ID
        },
      },
      type: "VIDEO",
      status: "COMPLETED",
      prompt: metadata.prompt,
      model: metadata.model || "fal-ai/kling-video/v1.5/pro",
      outputUrls: [cloudFrontUrl],
      creditsUsed: 10,
      metadata: JSON.stringify({
        duration: metadata.duration || "5",
        aspectRatio: metadata.aspectRatio || "16:9",
      }),
    };

    // Save to database
    const savedContent = await prisma.generatedContent.create({
      data: createData,
    });

    return {
      message: "Video uploaded successfully",
      url: cloudFrontUrl,
      contentId: savedContent.id,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Validate webhook payload
    const validatedPayload = WebhookPayloadSchema.parse(payload);

    switch (validatedPayload.status) {
      case "COMPLETED":
        // Handle successful video generation
        const videoUrl = validatedPayload.result?.data?.video?.url;

        if (!videoUrl) {
          console.error("No video URL found in the payload");
          return NextResponse.json(
            { error: "No video URL found" },
            { status: 400 }
          );
        }

        // Upload video to S3 and save to database
        const uploadResult = await uploadVideoToS3(videoUrl, {
          userId: validatedPayload.userId || null,
          prompt: validatedPayload.prompt || "Unnamed Video Generation",
          model: validatedPayload.model,
          duration: validatedPayload.duration,
          aspectRatio: validatedPayload.aspectRatio,
        });

        console.log(`Video generated and uploaded: ${uploadResult.url}`);

        return NextResponse.json(uploadResult, { status: 200 });

      case "IN_PROGRESS":
        // Optionally log progress
        console.log(
          `Video generation in progress: ${validatedPayload.request_id}`
        );
        break;

      case "FAILED":
        // Handle generation failure
        console.error(`Video generation failed: ${validatedPayload.error}`);
        break;
    }

    return NextResponse.json(
      {
        message: "Webhook processed successfully",
        status: validatedPayload.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        message: "Invalid webhook payload",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
