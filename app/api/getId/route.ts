// import { fetchUserImage } from "@/app/collection/connection";
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get("email");

//   if (!email || typeof email !== "string") {
//     return Response.json({ message: "Invalid email" });
//   }

//   try {
//     const userId = await fetchUserId(email as string);

//     // Always return a valid JSON response

//     if (!userId) {
//       return Response.json({ message: "User not found" });
//     }
//     return Response.json({ userId });
//   } catch (error) {
//     console.error("Error fetching User:", error);
//     return Response.json({ message: "Internal server error" });
//   }
// }
