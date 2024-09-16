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
  const { username, email } = await req.json();
  try {    
    const result = await updateUserById(userid, username, email);
    return Response.json({ success: true, data: result });
  } catch (err) {
    return Response.json({ success: false, message: "No data found" });
  }
}
