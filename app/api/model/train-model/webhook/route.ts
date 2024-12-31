import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { auth } from "@/auth";
import { use } from "react";
import { prisma } from "@/utils/prisma";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
export async function POST(req: Request) {
  const data = await auth();
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    // webhook-id
    const id = req.headers.get("webhook-id") ?? "";
    const timeStamp = req.headers.get("webhook-timeStamp") ?? "";
    const webhookSignature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timeStamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();
    const secretBytes = new Buffer(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");
    console.log(signature);

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === signature
    );
    console.log(isValid);
    if (!isValid) {
      return NextResponse.json("Invalid signature", { status: 401 });
    }

    // get user data
    const user = data?.user;
    const user_id = user?.id;
    const userEmail = user?.email;
    if (user || user_id) {
      return NextResponse.json("User not found", { status: 401 });
    }

    if (body.status === "succeeded") {
      // update the database
      await prisma.training.updateMany({
        where: {
          model_id: modelName,
          user_id: user_id,
        },
        data: {
          training_status: body.status,
          training_time: body.metrics?.total_time,
        },
      });
    } else {
      // handle the canceled and failed status
      await prisma.training.updateMany({
        where: {
          model_id: modelName,
          user_id: user_id,
        },
        data: {
          training_status: body.status,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json("internal server error: ", { status: 500 });
  }
}
