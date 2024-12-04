import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { numberOfImages, model } = await req.json();
    const userId = session.user.id;

    // Calculate credits based on the model
    let creditsToDeduct: number;
    switch (model) {
      case "black-forest-labs/FLUX.1-schnell":
        creditsToDeduct = numberOfImages * 2;
        break;
      case "black-forest-labs/FLUX.1.1-pro":
        creditsToDeduct = numberOfImages * 12;
        break;
      case "fal-ai/flux/dev":
        creditsToDeduct = numberOfImages * 8;
        break;
      case "fal-ai/face-to-sticker":
        creditsToDeduct = numberOfImages * 12;
        break;
      case "fal-ai/recraft-v3":
        creditsToDeduct = numberOfImages * 12;
        break;
      case "fal-ai/kling-video/v1.5/pro/text-to-video":
        creditsToDeduct = numberOfImages * 25;
        break;
      default:
        creditsToDeduct = numberOfImages * 2; // Default to 2 credits per image
    }

    const updatedUserCredit = await prisma.userCredit.update({
      where: { userId },
      data: { credits: { decrement: creditsToDeduct } },
    });

    return NextResponse.json({
      credits: updatedUserCredit.credits,
      creditsDeducted: creditsToDeduct,
    });
  } catch (error) {
    console.error("Error deducting credits:", error);
    return NextResponse.json(
      { error: "Error deducting the credits" },
      { status: 500 }
    );
  }
}
