import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { writeFile } from "fs/promises";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "nodejs"; // Specify the runtime
export const dynamic = "force-dynamic"; // If you need dynamic routing

export async function POST(req: NextRequest) {
  try {
    // Get form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optional: Save file locally (if needed)
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const fullPath = path.join(uploadDir, uniqueFileName);

    await writeFile(fullPath, buffer);

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `uploads/${uniqueFileName}`,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    };

    const uploadCommand = new PutObjectCommand(params);
    await s3Client.send(uploadCommand);

    const zipUrl = `https://${process.env.AWS_BUCKET_NAME_TRAINING}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`;

    return NextResponse.json({ zipUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
