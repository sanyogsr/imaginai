// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const contentType = req.headers.get("content-type");

//     // Parse the request body based on the content type
//     let body: Record<string, string> = {};
//     if (contentType?.includes("application/json")) {
//       body = await req.json();
//     } else if (contentType?.includes("application/x-www-form-urlencoded")) {
//       const formData = await req.text();
//       body = Object.fromEntries(new URLSearchParams(formData).entries());
//     } else {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "Unsupported content type. Expected application/json or application/x-www-form-urlencoded",
//         },
//         { status: 400 }
//       );
//     }

//     console.log("Parsed body:", body);

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

//     // Validate required fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields in request body" },
//         { status: 400 }
//       );
//     }

//     // Get the secret key from environment variables
//     const keySecret = process.env.RAZORPAY_SECRET_TEST;
//     if (!keySecret) {
//       console.error("Razorpay secret key not set in environment variables.");
//       return NextResponse.json(
//         { success: false, error: "Internal server error" },
//         { status: 500 }
//       );
//     }

//     // Verify the signature
//     const expectedSignature = crypto
//       .createHmac("sha256", keySecret)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     // Redirect URLs
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
//       return NextResponse.redirect(successUrl, { status: 303 });
//     } else {
//       console.error("Invalid signature verification.");
//       return NextResponse.redirect(failureUrl, { status: 303 });
//     }
//   } catch (error) {
//     console.error("Error processing Razorpay callback:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    console.log(`[DEBUG] Content-Type: ${contentType}`);

    let body: Record<string, string> = {};
    if (contentType?.includes("application/json")) {
      body = await req.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData).entries());
    } else {
      console.error(`[ERROR] Unsupported content type: ${contentType}`);
      return NextResponse.json(
        {
          success: false,
          error:
            "Unsupported content type. Expected application/json or application/x-www-form-urlencoded",
        },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Log incoming body for debugging
    console.log(`[DEBUG] Callback body received:`, body);

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error(`[ERROR] Missing required fields in request body.`);
      return NextResponse.json(
        { success: false, error: "Missing required fields in request body" },
        { status: 400 }
      );
    }

    console.log(`[INFO] Verifying payment for Order ID: ${razorpay_order_id}`);

    const keySecret = process.env.RAZORPAY_SECRET_TEST;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret!)
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
      console.log(
        `[SUCCESS] Payment verified successfully. Redirecting to success URL.`
      );
      return NextResponse.redirect(successUrl, { status: 303 });
    } else {
      console.error(
        `[ERROR] Invalid signature verification. Redirecting to failure URL.`
      );
      return NextResponse.redirect(failureUrl, { status: 303 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[ERROR] Internal server error:`, error.message || error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
