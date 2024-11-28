// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const contentType = req.headers.get("content-type");
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let body: any;

//     if (contentType === "application/json") {
//       body = await req.json();
//     } else if (contentType === "application/x-www-form-urlencoded") {
//       const formData = await req.text();
//       body = Object.fromEntries(new URLSearchParams(formData).entries());
//     } else {
//       console.error("Unsupported content type:", contentType);
//       return NextResponse.json(
//         { success: false, error: "Unsupported content type" },
//         { status: 400 }
//       );
//     }

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
//     console.log(
//       ` ${razorpay_order_id}, ${razorpay_payment_id}, ${razorpay_signature} `
//     );

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       console.error("Missing required fields in the request body.");
//       return NextResponse.json(
//         { success: false, error: "Invalid request body" },
//         { status: 400 }
//       );
//     }

//     const keySecret = process.env.RAZORPAY_SECRET_TEST;
//     if (!keySecret) {
//       console.error("Razorpay secret key not set.");
//       return NextResponse.json(
//         { success: false, error: "Internal server error" },
//         { status: 500 }
//       );
//     }

//     const expectedSignature = crypto
//       .createHmac("sha256", keySecret)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     const baseUrl = process.env.NEXTAUTH_URL || "https://imaginai.art";
//     const successUrl = new URL(
//       "/dashboard/payment/success",
//       baseUrl
//     ).toString();
//     const failureUrl = new URL(
//       "/dashboard/payment/failure",
//       baseUrl
//     ).toString();

//     if (expectedSignature === razorpay_signature) {
//       console.log("Payment verified successfully.");
//       return NextResponse.redirect(successUrl);
//     } else {
//       console.error("Invalid signature.");
//       return NextResponse.redirect(failureUrl);
//     }
//   } catch (error) {
//     console.error("Error during signature verification:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
// }
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");

    // Parse the request body based on the content type
    let body: Record<string, string> = {};
    if (contentType?.includes("application/json")) {
      body = await req.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData).entries());
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unsupported content type. Expected application/json or application/x-www-form-urlencoded",
        },
        { status: 400 }
      );
    }

    console.log("Parsed body:", body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required fields in request body" },
        { status: 400 }
      );
    }

    // Get the secret key from environment variables
    const keySecret = process.env.RAZORPAY_SECRET_TEST;
    if (!keySecret) {
      console.error("Razorpay secret key not set in environment variables.");
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }

    // Verify the signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Redirect URLs
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
      return NextResponse.redirect(successUrl, { status: 303 });
    } else {
      console.error("Invalid signature verification.");
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
  } catch (error) {
    console.error("Error processing Razorpay callback:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
