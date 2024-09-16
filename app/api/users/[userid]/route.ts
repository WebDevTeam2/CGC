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
    console.log(username, email);
    const result = await updateUserById(userid, username, email, password);
    return Response.json({ success: true, data: result });
  } catch (err) {
    return Response.json({ success: false, message: "No data found" });
  }
}
