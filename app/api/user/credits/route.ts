import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json(
      {
        error: "Unauthenticated",
      },
      { status: 401 }
    );
  }

  const userId = session.user?.id;

  try {
    const user = await prisma.userCredit.findUnique({
      where: { userId: userId },
      select: {
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error("error : ", error);
    return NextResponse.json(
      {
        error: "Failed to fetch credits",
      },
      {
        status: 500,
      }
    );
  }
}
