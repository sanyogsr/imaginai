// // app/api/og/route.tsx
// import { ImageResponse } from "next/og";
// import { NextRequest } from "next/server";

// export const runtime = "edge";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     // Dynamic params
//     const title = searchParams.get("title") || "AI Image Generator";
//     const description =
//       searchParams.get("description") ||
//       "Create stunning AI-generated images instantly";
//     const theme = searchParams.get("theme") || "dark";

//     // Font
//     // const interSemiBold = fetch(
//     //   new URL(
//     //     "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZFhjg.ttf",
//     //     request.url
//     //   )
//     // ).then((res) => res.arrayBuffer());
//     // const interSemiBold = fetch(
//     //   new URL("/fonts/inter-semi-bold.ttf", request.url)
//     // ).then((res) => res.arrayBuffer());
//     // const fontData = await interSemiBold;

//     return new ImageResponse(
//       (
//         <div
//           style={{
//             height: "100%",
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
//             backgroundImage:
//               theme === "dark"
//                 ? "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)"
//                 : "radial-gradient(circle at 25px 25px, #ddd 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ddd 2%, transparent 0%)",
//             backgroundSize: "100px 100px",
//           }}
//         >
//           {/* Gradient Overlay */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background:
//                 theme === "dark"
//                   ? "linear-gradient(45deg, rgba(123, 31, 162, 0.5), rgba(103, 58, 183, 0.5))"
//                   : "linear-gradient(45deg, rgba(156, 39, 176, 0.3), rgba(103, 58, 183, 0.3))",
//               zIndex: 1,
//             }}
//           />

//           {/* Content Container */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 2,
//               padding: "20px",
//             }}
//           >
//             {/* Logo/Icon */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "80px",
//                 height: "80px",
//                 borderRadius: "20px",
//                 backgroundColor: theme === "dark" ? "#ffffff" : "#000000",
//                 marginBottom: "20px",
//               }}
//             >
//               <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M12 2L2 7L12 12L22 7L12 2Z"
//                   stroke={theme === "dark" ? "#000000" : "#ffffff"}
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M2 17L12 22L22 17"
//                   stroke={theme === "dark" ? "#000000" : "#ffffff"}
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//                 <path
//                   d="M2 12L12 17L22 12"
//                   stroke={theme === "dark" ? "#000000" : "#ffffff"}
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>

//             {/* Title */}
//             <div
//               style={{
//                 display: "flex",
//                 fontSize: "60px",
//                 fontFamily: "Inter",
//                 fontWeight: 700,
//                 letterSpacing: "-0.05em",
//                 color: theme === "dark" ? "#ffffff" : "#000000",
//                 marginBottom: "20px",
//                 textAlign: "center",
//                 lineHeight: 1.2,
//               }}
//             >
//               {title}
//             </div>

//             {/* Description */}
//             <div
//               style={{
//                 display: "flex",
//                 fontSize: "30px",
//                 fontFamily: "Inter",
//                 color: theme === "dark" ? "#888888" : "#666666",
//                 textAlign: "center",
//                 marginTop: "10px",
//                 lineHeight: 1.4,
//                 maxWidth: "700px",
//               }}
//             >
//               {description}
//             </div>
//           </div>
//         </div>
//       ),
//       {
//         width: 1200,
//         height: 630,
//         // fonts: [
//         //   {
//         //     name: "Inter",
//         //     data: fontData,
//         //     style: "normal",
//         //   },
//         // ],
//       }
//     );
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (e: any) {
//     return new Response(`Failed to generate image`, {
//       status: 500,
//     });
//   }
// }
// app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.get("title") || "AI Image Generator";
    const description =
      searchParams.get("description") ||
      "Create stunning AI-generated images instantly";
    const theme = searchParams.get("theme") || "dark";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            fontFamily: "'Inter', sans-serif",
            background: theme === "dark" ? "#0d1117" : "#f3f4f6",
            overflow: "hidden",
          }}
        >
          {/* Gradient Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #1f1f1f, #2c2c2c)"
                  : "linear-gradient(135deg, #ffffff, #e5e7eb)",
              zIndex: "0px",
            }}
          />

          {/* Overlay with Glassmorphism */}
          <div
            style={{
              position: "absolute",
              inset: "50px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow:
                "0 4px 30px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
              zIndex: "1px",
            }}
          />

          {/* Title */}
          <h1
            style={{
              fontSize: "80px",
              fontWeight: 800,
              color: theme === "dark" ? "#ffffff" : "#1f2937",
              textAlign: "center",
              zIndex: "2px",
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
              margin: "0 20px",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "36px",
              fontWeight: 400,
              color: theme === "dark" ? "#d1d5db" : "#4b5563",
              textAlign: "center",
              maxWidth: "800px",
              zIndex: "2px",
              margin: "20px 20px 0",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>

          {/* Decorative Elements */}
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              background: "rgba(123, 97, 255, 0.4)",
              filter: "blur(100px)",
              top: "20%",
              left: "10%",
              borderRadius: "50%",
              zIndex: "0px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              background: "rgba(255, 123, 123, 0.3)",
              filter: "blur(150px)",
              bottom: "10%",
              right: "15%",
              borderRadius: "50%",
              zIndex: "0px",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
