import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_TEST!,
  key_secret: process.env.RAZORPAY_SECRET_TEST!,
});

export async function POST(req: NextRequest) {
  try {
    const { price } = await req.json();

    const order = await razorpay.orders.create({
      amount: price * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (err) {
    console.error("error", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
