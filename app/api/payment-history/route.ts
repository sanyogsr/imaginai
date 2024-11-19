import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Add cache headers helper
const addCacheHeaders = (response: NextResponse) => {
  // Cache for 1 minute on client side
  response.headers.set("Cache-Control", "private, max-age=60");
  return response;
};

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: session.user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      // Optional: Limit the number of results for better performance
      take: 50,
    });

    const response = NextResponse.json(payments);
    return addCacheHeaders(response);
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return NextResponse.json(
      { error: "Error fetching payment history" },
      { status: 500 }
    );
  }
}
