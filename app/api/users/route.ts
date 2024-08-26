import { addUser } from "@/app/collection/connection";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    const result = await addUser({
      username,
      email,
      password,
    });
    return Response.json({
      message:
        "User added successfully, please check your email for verification.",
      result,
    });
  } catch (error: any) {
    console.error("Failed to add user:", error);
    // Determine the appropriate status code and message
    let status = 400;
    let message = error.message || "Failed to add user";

    return new Response(JSON.stringify({ message }), { status });
  }
}
