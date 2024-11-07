import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import {  NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const upadteUserCredit = await prisma.userCredit.update({
      where: {
        userId: userId,
      },
      data: {
        credits: { decrement: 2 },
      },
    });

    return NextResponse.json({ credits: upadteUserCredit.credits });
  } catch (error) {
    console.error("error : ", error);
    return NextResponse.json(
      { error: "Error deducting the credits" },
      {
        status: 500,
      }
    );
  }
}
