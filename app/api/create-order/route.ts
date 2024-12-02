// import { NextRequest, NextResponse } from "next/server";
// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_TEST!,
//   key_secret: process.env.RAZORPAY_SECRET_TEST!,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { price, credits } = await req.json();

//     const order = await razorpay.orders.create({
//       amount: price * 100,
//       currency: "INR",
//       receipt: "receipt_" + Math.random().toString(36).substring(7),
//     });
//     return NextResponse.json(
//       {
//         orderId: order.id,
//         credits,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("error", err);
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_TEST!,
  key_secret: process.env.RAZORPAY_SECRET_TEST!,
});

export async function POST(req: Request) {
  try {
    const { price, credits } = await req.json();
    console.log(
      `[INFO] Order creation initiated with price: ${price}, credits: ${credits}`
    );

    const order = await razorpay.orders.create({
      amount: price * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2)}`,
    });

    console.log(
      `[SUCCESS] Razorpay order created successfully. Order ID: ${order.id}`
    );
    return NextResponse.json({ orderId: order.id, credits }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[ERROR] Failed to create order:`, error.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
