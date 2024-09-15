import { fetchUserDets } from "@/app/collection/connection";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email || typeof email !== "string") {
    return Response.json({ message: "Invalid email" });
  }

  try {
    const { _id, profilePicture } = await fetchUserDets(email as string);

    if (!_id) {
      return Response.json({ message: "User not found" });
    }
    return Response.json({ _id, profilePicture });
  } catch (error) {
    console.error("Error fetching User:", error);
    return Response.json({ message: "Internal server error" });
  }
}
