// /app/api/users/verify.ts

import { verifyUserEmail } from "@/app/collection/connection";
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";

// API Route to verify user email
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token || typeof token !== "string") {
    return NextResponse.json({ message: "Token is required" });
  }
  try {
    const { status, message, user } = await verifyUserEmail(token);
    if (status && user) {
      // Attempt to sign the user in after successful verification
      const signInResult = await signIn("credentials", {
        redirect: false, // Don't redirect automatically
        email: user.email, // You need the email from the verified user object
        password: user.password, // Assuming password is retrievable or temporarily stored
      });

      if (signInResult?.error) {
        return NextResponse.json({ message: "Error during automatic sign-in" });
      }
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
