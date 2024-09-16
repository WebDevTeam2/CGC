import { findUserById, updateUserById } from "@/app/collection/connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const result = await findUserById(userid);
    return Response.json({ success: true, data: result });
  } catch (err) {
    return Response.json({ success: false, message: "No data found" });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  const { username, email, password } = await req.json();
  try {
    // Fetch the current user data
    const currentUser = await findUserById(userid);

    // Prepare the updated fields
    const updatedFields: any = {
      username: username || currentUser?.username, // Default to current username if not provided
      email: email || currentUser?.email, // Default to current email if not provided
    };

    // Only update password if it's provided and non-empty
    if (password && password.trim()) {
      updatedFields.password = password;
    }

    // Update user in the database
    const result = await updateUserById(userid, updatedFields);

    return Response.json({ success: true, data: result });
  } catch (err) {
    return Response.json({ success: false, message: "No data found" });
  }
}
