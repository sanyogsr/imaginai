// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import { prisma } from "@/utils/prisma";

// const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";

// export async function POST(req: NextRequest) {
//   const signature = req.headers.get("x-razorpay-signature");
//   const body = await req.json();

//   if (!signature) {
//     return NextResponse.json(
//       { error: "Missing Razorpay signature." },
//       { status: 403 }
//     );
//   }

//   const expectedSignature = crypto
//     .createHmac("sha256", RAZORPAY_SECRET)
//     .update(JSON.stringify(body))
//     .digest("hex");

//   if (signature !== expectedSignature) {
//     return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
//   }

//   const { event, payload } = body;

//   console.log(`Received Razorpay event: ${event}`);

//   if (event === "payment.captured") {
//     const userId = payload.payment.entity.notes?.user_id;
//     const amount = payload.payment.entity.amount / 100;
//     const credits = calculateCredits(amount);
//     const razorpayPaymentId = payload.payment.entity.id;
//     const currency = payload.payment.entity.currency;
//     const status = "captured";

//     try {
//       // Add credits to user account
//       await addCreditsToUserAccount(userId, credits);

//       // Create a payment record
//       await prisma.payment.create({
//         data: {
//           userId,
//           razorpayPaymentId,
//           amount,
//           currency,
//           status,
//           metadata: payload.payment.entity,
//         },
//       });

//       return NextResponse.json({
//         status: "Credits added and payment recorded successfully.",
//       });
//     } catch (error) {
//       console.error("Error adding credits or recording payment:", error);
//       return NextResponse.json(
//         { error: "Error adding credits or recording payment." },
//         { status: 500 }
//       );
//     }
//   } else if (event === "payment.failed") {
//     const failureReason = payload.payment.entity.error_reason;
//     const userId = payload.payment.entity.notes?.user_id;
//     const amount = payload.payment.entity.amount / 100;

//     console.log(
//       `Payment failed for user: ${userId}, Amount: ${amount}, Reason: ${failureReason}`
//     );

//     try {
//       await prisma.paymentFailureLog.create({
//         data: {
//           userId,
//           amount,
//           reason: failureReason,
//           paymentId: payload.payment.entity.id,
//           createdAt: new Date(),
//         },
//       });

//       return NextResponse.json({
//         status: "Payment failure logged successfully.",
//       });
//     } catch (error) {
//       console.error("Error logging payment failure:", error);
//       return NextResponse.json(
//         { error: "Error logging payment failure." },
//         { status: 500 }
//       );
//     }
//   } else {
//     console.log(`Unhandled event type: ${event}`);
//     return NextResponse.json(
//       { error: "Unhandled event type." },
//       { status: 400 }
//     );
//   }
// }

// function calculateCredits(amount: number) {
//   if (amount === 1) return 2;
//   if (amount === 60) return 120;
//   if (amount === 190) return 500;
//   if (amount === 200) return 500;
//   if (amount === 380) return 1000;
//   if (amount === 400) return 1000;
//   return 0;
// }

// async function addCreditsToUserAccount(userId: string, credits: number) {
//   try {
//     let userCredit = await prisma.userCredit.findUnique({ where: { userId } });

//     if (!userCredit) {
//       userCredit = await prisma.userCredit.create({
//         data: { userId, credits, lifetimeCredits: credits },
//       });
//     } else {
//       userCredit = await prisma.userCredit.update({
//         where: { userId },
//         data: {
//           credits: userCredit.credits + credits,
//           lifetimeCredits: userCredit.lifetimeCredits + credits,
//         },
//       });
//     }

//     console.log(`Successfully added ${credits} credits to user ${userId}.`);
//     return userCredit;
//   } catch (error) {
//     console.error("Error updating user credits:", error);
//     throw new Error("Failed to add credits to user account.");
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/utils/prisma";

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  const body = await req.json();

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Razorpay signature." },
      { status: 403 }
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
  }

  const { event, payload } = body;
  const paymentId = payload.payment?.entity?.id;

  // Deduplication check
  const existingPayment = await prisma.payment.findUnique({
    where: { razorpayPaymentId: paymentId },
  });
  if (existingPayment) {
    return NextResponse.json(
      { status: "Duplicate webhook received." },
      { status: 200 }
    );
  }

  console.log(`Received Razorpay event: ${event}`);

  if (event === "payment.captured") {
    return await handlePaymentCaptured(payload);
  } else if (event === "payment.failed") {
    return await handlePaymentFailed(payload);
  } else {
    console.log(`Unhandled event type: ${event}`);
    return NextResponse.json(
      { status: "Event logged but not processed." },
      { status: 200 }
    );
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePaymentCaptured(payload: any) {
  const userId = payload.payment.entity.notes?.user_id;
  const amount = payload.payment.entity.amount / 100;
  const credits = calculateCredits(amount);
  const razorpayPaymentId = payload.payment.entity.id;
  const currency = payload.payment.entity.currency;

  try {
    await prisma.$transaction(async (prisma) => {
      // Add credits to user account
      const userCredit = await prisma.userCredit.findUnique({
        where: { userId },
      });

      if (!userCredit) {
        await prisma.userCredit.create({
          data: { userId, credits, lifetimeCredits: credits },
        });
      } else {
        await prisma.userCredit.update({
          where: { userId },
          data: {
            credits: userCredit.credits + credits,
            lifetimeCredits: userCredit.lifetimeCredits + credits,
          },
        });
      }

      // Record payment in the database
      await prisma.payment.create({
        data: {
          userId,
          razorpayPaymentId,
          amount,
          currency,
          status: "captured",
          metadata: payload.payment.entity,
        },
      });
    });

    return NextResponse.json({
      status: "Credits added and payment recorded successfully.",
    });
  } catch (error) {
    console.error("Error in payment captured handler:", error);
    return NextResponse.json(
      { error: "Error processing payment." },
      { status: 500 }
    );
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePaymentFailed(payload: any) {
  const failureReason = payload.payment.entity.error_reason;
  const userId = payload.payment.entity.notes?.user_id;
  const amount = payload.payment.entity.amount / 100;

  console.log(
    `Payment failed for user: ${userId}, Amount: ${amount}, Reason: ${failureReason}`
  );

  try {
    await prisma.paymentFailureLog.create({
      data: {
        userId,
        amount,
        reason: failureReason,
        paymentId: payload.payment.entity.id,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "Payment failure logged successfully.",
    });
  } catch (error) {
    console.error("Error logging payment failure:", error);
    return NextResponse.json(
      { error: "Error logging payment failure." },
      { status: 500 }
    );
  }
}

function calculateCredits(amount: number): number {
  const creditMap: { [key: number]: number } = {
    1: 2,
    2: 2,
    89: 120,
    199: 420,
    399: 900,
  };
  return creditMap[amount] || 0; // Default to 0 credits for unknown amounts
}
