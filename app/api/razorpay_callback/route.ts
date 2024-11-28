import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;

    if (contentType === "application/json") {
      body = await req.json();
    } else if (contentType === "application/x-www-form-urlencoded") {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData).entries());
    } else {
      console.error("Unsupported content type:", contentType);
      return NextResponse.json(
        { success: false, error: "Unsupported content type" },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing required fields in the request body.");
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_SECRET_TEST;
    if (!keySecret) {
      console.error("Razorpay secret key not set.");
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const baseUrl = process.env.NEXTAUTH_URL || "https://imaginai.art";
    const successUrl = new URL(
      "/dashboard/payment/success",
      baseUrl
    ).toString();
    const failureUrl = new URL(
      "/dashboard/payment/failure",
      baseUrl
    ).toString();

    if (expectedSignature === razorpay_signature) {
      console.log("Payment verified successfully.");
      return NextResponse.redirect(successUrl);
    } else {
      console.error("Invalid signature.");
      return NextResponse.redirect(failureUrl);
    }
  } catch (error) {
    console.error("Error during signature verification:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
