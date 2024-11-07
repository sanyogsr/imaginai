import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const signature = req.headers["x-razorpay-signature"] as string;
  const body = JSON.stringify(req.body);

  // Verify the Razorpay webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (signature === expectedSignature) {
    const { event, payload } = req.body;

    // Handle the `payment.captured` event
    if (event === "payment.captured") {
      const paymentId = payload.payment.entity.id;
      const amount = payload.payment.entity.amount; // Amount is in paise
      const userId = payload.payment.entity.notes?.user_id; // Retrieve user ID if passed during order creation

      try {
        // Add credits to user's account based on payment
        await addCreditsToUserAccount(userId, amount / 100); // Convert amount to rupees
        return res.status(200).json({ status: "Credits added successfully." });
      } catch (error) {
        console.error("Error adding credits:", error);
        return res
          .status(500)
          .json({ error: "Error adding credits to account." });
      }
    }

    return res.status(400).json({ error: "Unhandled event type." });
  } else {
    return res.status(403).json({ error: "Invalid signature." });
  }
}

// Example function to add credits to a user's account
async function addCreditsToUserAccount(userId: string, credits: number) {
  // Update the user's credits in your database
  // Example: await User.update({ credits: { $inc: credits } }).where({ id: userId });
  console.log(`Adding ${credits} credits to user account with ID: ${userId}`);

  return {
    message: `Successfully added ${credits} credits to user ${userId}.`,
  };
}
