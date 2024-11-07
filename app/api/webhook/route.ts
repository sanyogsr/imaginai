import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature") as string;
  const body = await req.json();

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Razorpay signature." },
      { status: 403 }
    );
  }

  // Verify the Razorpay webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (signature === expectedSignature) {
    const { event, payload } = body;

    // Handle the `payment.captured` event
    if (event === "payment.captured") {
      const amount = payload.payment.entity.amount; // Amount is in paise
      const userId = payload.payment.entity.notes?.user_id; // Retrieve user ID if passed during order creation

      try {
        // Add credits to user's account based on payment
        await addCreditsToUserAccount(userId, amount / 100); // Convert amount to rupees
        return NextResponse.json({ status: "Credits added successfully." });
      } catch (error) {
        console.error("Error adding credits:", error);
        return NextResponse.json(
          { error: "Error adding credits to account." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Unhandled event type." },
      { status: 400 }
    );
  } else {
    return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
  }
}

// Example function to add credits to a user's account
async function addCreditsToUserAccount(userId: string, credits: number) {
  // Replace with actual database update logic
  console.log(`Adding ${credits} credits to user account with ID: ${userId}`);

  return {
    message: `Successfully added ${credits} credits to user ${userId}.`,
  };
}
