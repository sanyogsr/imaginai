import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function POrST() {
//   const session = await auth();
//   if (!session || !session.user?.id) {
//     return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
//   }

//   try {
//     const userId = session.user.id;
//     const upadteUserCredit = await prisma.userCredit.update({
//       where: {
//         userId: userId,
//       },
//       data: {
//         credits: { decrement: 2 },
//       },
//     });

//     return NextResponse.json({ credits: upadteUserCredit.credits });
//   } catch (error) {
//     console.error("error : ", error);
//     return NextResponse.json(
//       { error: "Error deducting the credits" },
//       {
//         status: 500,
//       }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { numberOfImages } = await req.json(); // Parse numberOfImages from request body
    const userId = session.user.id;

    // Calculate total credits to deduct based on number of images
    const creditsToDeduct = numberOfImages * 2; // Assume 2 credits per image

    const updatedUserCredit = await prisma.userCredit.update({
      where: { userId },
      data: { credits: { decrement: creditsToDeduct } },
    });

    return NextResponse.json({ credits: updatedUserCredit.credits });
  } catch (error) {
    console.error("Error deducting credits:", error);
    return NextResponse.json(
      { error: "Error deducting the credits" },
      { status: 500 }
    );
  }
}
