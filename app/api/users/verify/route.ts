// /app/api/users/verify.ts

import { verifyUserEmail } from "@/app/collection/connection";
import { NextRequest, NextResponse } from "next/server";

// API Route to verify user email
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "Token is required" });
  }
  try {
    const { status, message } = await verifyUserEmail(token);
    if (status) {
      // Get the base URL from the incoming request
      const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      // Construct a full URL for the redirect
      const redirectUrl = new URL("/Verified", baseUrl).toString();
      // If verification is successful, redirect to the Verified page
      return NextResponse.redirect(redirectUrl);
    } else {
      // If verification fails, return the failure message
      return NextResponse.json({ message });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ message: "Error verifying the email" });
  }
}
