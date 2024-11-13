import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Fetch the image from the cloud storage
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image data
    const imageData = await response.blob();

    // Return the image with appropriate headers
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename=generated-image-${Date.now()}.png`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
