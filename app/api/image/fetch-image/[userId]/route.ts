import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const userContent = await prisma.generatedContent.findMany({
      where: {
        userId: userId,
        type: "IMAGE",
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to last 50 images
    });

    const images = userContent.flatMap((content) => content.outputUrls);

    return NextResponse.json({
      images,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
