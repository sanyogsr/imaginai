// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Together from "together-ai";
import z from "zod";
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
type ExtendedImageParams = Parameters<typeof together.images.create>[0] & {
  response_format: string;
};
// Together AI API response type
// export async function POlST(req: NextRequest) {
//   try {
//     const values = await req.json();
//     const { prompt, model, width, height } = z
//       .object({
//         prompt: z.string(),
//         model: z.string(),
//         height: z.number(),
//         width: z.number(),
//       })
//       .parse(values);
//     // 1. Authentication
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const response = await together.images.create({
//       model: model,
//       prompt: prompt,
//       width: width,
//       height: height,
//       steps: 4,
//       n: 1,
//       response_format: "b64_json", // Required parameter
//     } as ExtendedImageParams);

//     console.log(response.data[0].b64_json);
//     return NextResponse.json({ response: response });
//   } catch (err) {
//     console.error("Error", err);
//     return NextResponse.json(
//       { error: "Failed to generate image" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req: NextRequest) {
  try {
    const values = await req.json();
    const { prompt, model, width, height, steps, n, style } = z
      .object({
        prompt: z.string(),
        model: z.string(),
        height: z.number(),
        width: z.number(),
        steps: z.number(),
        n: z.number(),
        style: z.string(),
      })
      .parse(values);

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await together.images.create({
      model,
      prompt,
      width,
      height,
      steps,
      n,
      style,
      response_format: "b64_json",
    } as ExtendedImageParams);

    return NextResponse.json({ response: response });
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
