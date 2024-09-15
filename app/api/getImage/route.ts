import { fetchUserImage } from "@/app/collection/connection";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email || typeof email !== "string") {
    return Response.json({ message: "Invalid email" });
  }

  try {
    const profilePicture = await fetchUserImage(email as string);

    // Always return a valid JSON response

    if (!profilePicture) {
      return Response.json({ message: "Profile picture not found" });
    }
    return Response.json({ profilePicture });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return Response.json({ message: "Internal server error" });
  }
}
