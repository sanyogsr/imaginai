// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import { prisma } from "@/utils/prisma";

// const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";

// export async function POST(req: NextRequest) {
//   const signature = req.headers.get("x-razorpay-signature") as string;
//   const body = await req.json();

//   if (!signature) {
//     return NextResponse.json(
//       { error: "Missing Razorpay signature." },
//       { status: 403 }
//     );
//   }

//   // Verify the Razorpay webhook signature
//   const expectedSignature = crypto
//     .createHmac("sha256", RAZORPAY_SECRET)
//     .update(JSON.stringify(body))
//     .digest("hex");

//   if (signature === expectedSignature) {
//     const { event, payload } = body;

//     // Handle the `payment.captured` event
//     if (event === "payment.captured") {
//       const amount = payload.payment.entity.amount / 100; // Amount is in Rs
//       const userId = payload.payment.entity.notes?.user_id; // Retrieve user ID if passed during order creation
//       let credits = 0;

//       if (amount === 1) credits = 2; // Hobby plan
//       else if (amount === 200) credits = 700; // Pro plan
//       else if (amount === 400) credits = 1600; // Value for money plan
//       try {
//         // Add credits to user's account based on payment
//         await addCreditsToUserAccount(userId, credits); // Convert amount to rupees
//         return NextResponse.json({ status: "Credits added successfully." });
//       } catch (error) {
//         console.error("Error adding credits:", error);
//         return NextResponse.json(
//           { error: "Error adding credits to account." },
//           { status: 500 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: "Unhandled event type." },
//       { status: 400 }
//     );
//   } else {
//     return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
//   }
// }

// // Example function to add credits to a user's account
// async function addCreditsToUserAccount(userId: string, credits: number) {
//   try {
//     // Fetch the existing UserCredit record
//     let userCredit = await prisma.userCredit.findUnique({
//       where: { userId },
//     });

//     if (!userCredit) {
//       // If no UserCredit record exists, create a new one
//       userCredit = await prisma.userCredit.create({
//         data: {
//           userId,
//           credits,
//           lifetimeCredits: credits,
//         },
//       });
//     } else {
//       // If a UserCredit record exists, update the credits
//       userCredit = await prisma.userCredit.update({
//         where: { userId },
//         data: {
//           credits: userCredit.credits + credits,
//           lifetimeCredits: userCredit.lifetimeCredits + credits,
//         },
//       });
//     }

//     console.log(`Successfully added ${credits} credits to user ${userId}.`);

//     return {
//       message: `Successfully added ${credits} credits to user ${userId}.`,
//       userCredit,
//     };
//   } catch (error) {
//     console.error("Error updating user credits:", error);
//     throw new Error("Failed to add credits to user account.");
//   }
// }
// export async function POST(req: NextRequest) {
//   const signature = req.headers.get("x-razorpay-signature");
//   const body = await req.json();

//   if (!signature) {
//     return NextResponse.json(
//       { error: "Missing Razorpay signature." },
//       { status: 403 }
//     );
//   }

//   // Verify Razorpay signature
//   const expectedSignature = crypto
//     .createHmac("sha256", RAZORPAY_SECRET)
//     .update(JSON.stringify(body))
//     .digest("hex");

//   if (signature !== expectedSignature) {
//     return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
//   }

//   const { event, payload } = body;
//   const userId = payload.payment.entity.notes?.user_id;
//   const amount = payload.payment.entity.amount / 100;

//   if (!userId || !amount) {
//     return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
//   }

//   if (event === "payment.captured") {
//     const credits = calculateCredits(amount);

//     try {
//       await addCreditsToUserAccount(userId, credits);
//       return NextResponse.json({ status: "Credits added successfully." });
//     } catch (error) {
//       console.error("Error adding credits:", error);
//       return NextResponse.json(
//         { error: "Error adding credits to account." },
//         { status: 500 }
//       );
//     }
//   }

//   console.log("Unhandled event type:", event);
//   return NextResponse.json({ error: "Unhandled event type." }, { status: 400 });
// }
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

//     try {
//       await addCreditsToUserAccount(userId, credits);
//       return NextResponse.json({ status: "Credits added successfully." });
//     } catch (error) {
//       console.error("Error adding credits:", error);
//       return NextResponse.json(
//         { error: "Error adding credits to account." },
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
//   if (amount === 200) return 700;
//   if (amount === 400) return 1600;
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

  console.log(`Received Razorpay event: ${event}`);

  if (event === "payment.captured") {
    const userId = payload.payment.entity.notes?.user_id;
    const amount = payload.payment.entity.amount / 100;
    const credits = calculateCredits(amount);
    const razorpayPaymentId = payload.payment.entity.id;
    const currency = payload.payment.entity.currency;
    const status = "captured";

    try {
      // Add credits to user account
      await addCreditsToUserAccount(userId, credits);

      // Create a payment record
      await prisma.payment.create({
        data: {
          userId,
          razorpayPaymentId,
          amount,
          currency,
          status,
          metadata: payload.payment.entity,
        },
      });

      return NextResponse.json({
        status: "Credits added and payment recorded successfully.",
      });
    } catch (error) {
      console.error("Error adding credits or recording payment:", error);
      return NextResponse.json(
        { error: "Error adding credits or recording payment." },
        { status: 500 }
      );
    }
  } else if (event === "payment.failed") {
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
  } else {
    console.log(`Unhandled event type: ${event}`);
    return NextResponse.json(
      { error: "Unhandled event type." },
      { status: 400 }
    );
  }
}

function calculateCredits(amount: number) {
  if (amount === 1) return 2;
  if (amount === 200) return 700;
  if (amount === 400) return 1600;
  return 0;
}

async function addCreditsToUserAccount(userId: string, credits: number) {
  try {
    let userCredit = await prisma.userCredit.findUnique({ where: { userId } });

    if (!userCredit) {
      userCredit = await prisma.userCredit.create({
        data: { userId, credits, lifetimeCredits: credits },
      });
    } else {
      userCredit = await prisma.userCredit.update({
        where: { userId },
        data: {
          credits: userCredit.credits + credits,
          lifetimeCredits: userCredit.lifetimeCredits + credits,
        },
      });
    }

    console.log(`Successfully added ${credits} credits to user ${userId}.`);
    return userCredit;
  } catch (error) {
    console.error("Error updating user credits:", error);
    throw new Error("Failed to add credits to user account.");
  }
}
