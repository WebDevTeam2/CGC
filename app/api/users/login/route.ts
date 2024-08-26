// /app/api/users/login.ts

import { logUser } from "@/app/collection/connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get email and password
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call the logUser function to verify the user
    const { status, message } = await logUser(email, password);

    // Return the appropriate status and message
    return NextResponse.json({ message }, { status });
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
