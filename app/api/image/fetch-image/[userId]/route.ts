// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/utils/prisma";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const userId = params.userId;

//     const userContent = await prisma.generatedContent.findMany({
//       where: {
//         userId: userId,
//         type: "IMAGE",
//         status: "COMPLETED",
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: 50, // Limit to last 50 images
//     });

//     const images = userContent.flatMap((content) => content.outputUrls);

//     return NextResponse.json({
//       images,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch images" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "90");
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.generatedContent.count({
      where: {
        userId: userId,
        type: "IMAGE",
        status: "COMPLETED",
      },
    });

    // Get paginated content
    const userContent = await prisma.generatedContent.findMany({
      where: {
        userId: userId,
        type: "IMAGE",
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    const images = userContent.flatMap((content) => content.outputUrls);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      images,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
      },
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
