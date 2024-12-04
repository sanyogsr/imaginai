import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

interface VideoMetadata {
  duration?: string;
  aspectRatio?: string;
}

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  console.log("Extracted userId from params:", params.userId);

  try {
    const userId = params.userId;

    // Validate userId more explicitly
    if (!userId || userId.trim() === "") {
      console.error("No valid userId provided");
      return NextResponse.json(
        {
          error: "User ID is required",
          details: "userId cannot be null or empty",
        },
        { status: 400 }
      );
    }

    // Fetch video history for the user
    const videos = await prisma.generatedContent.findMany({
      where: {
        userId,
        type: "VIDEO",
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to 20 most recent videos
      select: {
        id: true,
        prompt: true,
        outputUrls: true,
        model: true,
        createdAt: true,
        metadata: true,
      },
    });

    console.log("Fetched videos count:", videos.length);

    // Transform the videos to match the VideoHistoryItem interface
    const transformedVideos = videos.map((video) => {
      // Parse metadata safely with type assertion
      let parsedMetadata: VideoMetadata = {};
      try {
        parsedMetadata = video.metadata
          ? JSON.parse(video.metadata as string)
          : {};
      } catch (error) {
        console.warn("Failed to parse metadata:", error);
      }

      return {
        id: video.id,
        userId,
        prompt: video.prompt,
        videoUrl: video.outputUrls[0],
        timestamp: video.createdAt.toISOString(),
        model: video.model,
        duration: parsedMetadata.duration ?? "5",
        aspectRatio: parsedMetadata.aspectRatio ?? "16:9",
      };
    });

    return NextResponse.json({
      videos: transformedVideos,
      message: "Video history fetched successfully",
    });
  } catch (error) {
    console.error("Comprehensive error in video history fetch:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch video history",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
