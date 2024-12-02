import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();
    console.log(`[INFO] Verifying payment for Order ID: ${razorpay_order_id}`);

    const keySecret = process.env.RAZORPAY_SECRET_TEST!;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log(`[SUCCESS] Payment verified successfully.`);
      return NextResponse.json({ success: true });
    } else {
      console.error(`[ERROR] Invalid signature verification.`);
      return NextResponse.json({ success: false, error: "Invalid signature" });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[ERROR] Failed to verify payment:`, error.message || error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
