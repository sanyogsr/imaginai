import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { prisma } from "@/utils/prisma"; // Adjust import path to your Prisma client
// import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// const bucketName = process.env.AWS_BUCKET_NAME2!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
    const fileBuffer = await file.arrayBuffer();
    const filename = `${uuidv4()}.zip`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: Buffer.from(fileBuffer),
        ContentType: "application/zip",
      })
    );

    const fileUrl = `https://d17d8sfx13z6g2.cloudfront.net/${filename}`;

    // const response = await prisma.generatedContent.createMany({
    //   data: uploadedImageUrls.map((url) => ({
    //     userId,
    //     type: "IMAGE",
    //     status: "COMPLETED",
    //     prompt,
    //     model,
    //     outputUrls: [url],
    //     creditsUsed,
    //   })),
    // });
    // console.log(response);
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
