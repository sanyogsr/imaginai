import { NextRequest, NextResponse } from "next/server";
import { createFalClient } from "@fal-ai/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/utils/prisma";
import { nanoid } from "nanoid";

// S3 Client Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME!;
const fal = createFalClient({
  proxyUrl: "/api/fal/proxy",
});

export async function POST(req: NextRequest) {
  try {
    // Parse webhook payload
    const payload = await req.json();

    // Validate payload structure
    if (!payload.request_id || !payload.status) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // Check if request was successful
    if (payload.status !== "COMPLETED") {
      console.log(
        `Request ${payload.request_id} did not complete successfully`
      );
      return NextResponse.json(
        { message: "Webhook received" },
        { status: 200 }
      );
    }

    // Fetch the full result from Fal AI
    const result = await fal.queue.result(
      "fal-ai/kling-video/v1.5/pro/text-to-video",
      { requestId: payload.request_id }
    );

    // Extract video URL from result
    const inputVideoUrl = result.data.video.url;

    if (!inputVideoUrl) {
      return NextResponse.json(
        { error: "No video URL found in result" },
        { status: 400 }
      );
    }

    // Retrieve additional metadata from Redis or your database
    // This is crucial to recover context lost on page refresh
    const requestMetadata = await prisma.videoGenerationRequest.findUnique({
      where: { requestId: payload.request_id },
    });

    if (!requestMetadata) {
      console.error(`No metadata found for request ${payload.request_id}`);
      return NextResponse.json(
        { error: "Request metadata not found" },
        { status: 404 }
      );
    }

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

    // Save to database
    const savedContent = await prisma.generatedContent.create({
      data: {
        userId: requestMetadata.userId,
        type: "VIDEO",
        status: "COMPLETED",
        prompt: requestMetadata.prompt,
        model: "fal-ai/kling-video/v1.5/pro",
        outputUrls: [cloudFrontUrl],
        creditsUsed: requestMetadata.creditsUsed || 10,
        metadata: JSON.stringify({
          duration: requestMetadata.duration || "5",
          aspectRatio: requestMetadata.aspectRatio || "16:9",
          requestId: payload.request_id,
        }),
      },
    });

    // Optional: Clean up the request metadata
    await prisma.videoGenerationRequest.delete({
      where: { requestId: payload.request_id },
    });

    return NextResponse.json({
      message: "Video uploaded successfully",
      url: cloudFrontUrl,
      contentId: savedContent.id,
    });
  } catch (error) {
    console.error("Webhook error processing video:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
