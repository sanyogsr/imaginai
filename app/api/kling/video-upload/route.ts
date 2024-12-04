import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    const {
      videoUrl: inputVideoUrl,
      userId,
      prompt,
      model = "fal-ai/kling-video/v1.5/pro",
      duration = "5",
      aspectRatio = "16:9",
      creditsUsed = 10, // Default credit cost
    } = await req.json();

    if (!inputVideoUrl) {
      return NextResponse.json(
        { error: "No video URL provided" },
        { status: 400 }
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
        userId,
        type: "VIDEO",
        status: "COMPLETED",
        prompt,
        model,
        outputUrls: [cloudFrontUrl],
        creditsUsed,
        metadata: JSON.stringify({
          duration,
          aspectRatio,
        }),
      },
    });

    return NextResponse.json({
      message: "Video uploaded successfully",
      url: cloudFrontUrl,
      contentId: savedContent.id,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
