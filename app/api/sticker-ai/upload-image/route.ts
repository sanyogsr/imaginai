import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/utils/prisma";
import { nanoid } from "nanoid";

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
    const { images, userId, prompt, model, creditsUsed } = await req.json();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const uploadedImageUrls: string[] = [];

    for (const image of images) {
      const imageId = nanoid();
      const imageBuffer = Buffer.from(image.split(",")[1], "base64");

      // Changed folder to 'stickers' instead of 'generated'
      const fileKey = `generated/stickers/${imageId}.png`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: imageBuffer,
        ContentType: "image/png",
      });

      await s3.send(command);

      const imageUrl = `https://d17d8sfx13z6g2.cloudfront.net/${fileKey}`;
      uploadedImageUrls.push(imageUrl);
    }
    const response = await prisma.generatedContent.createMany({
      data: uploadedImageUrls.map((url) => ({
        userId,
        type: "IMAGE",
        status: "COMPLETED",
        prompt,
        model,
        outputUrls: [url],
        creditsUsed,
      })),
    });
    return NextResponse.json({
      message: "Sticker images uploaded successfully",
      urls: uploadedImageUrls,
    });
  } catch (error) {
    console.error("Error uploading sticker images:", error);
    return NextResponse.json(
      { error: "Failed to upload sticker images" },
      { status: 500 }
    );
  }
}
