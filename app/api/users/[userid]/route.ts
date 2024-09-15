import { findUserById, updateUserById } from "@/app/collection/connection";
// import connect from "@/app/utils/connectdb/dbconnect";
// import User from "@/app/utils/Schema/userSchema";
// import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// connect();
export async function GET(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const result = await findUserById(userid);
    console.log(result);
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
    console.log(username, email);
    const result = await updateUserById(userid, username, email);
    return Response.json({ success: true, data: result });
  } catch (err) {
    return Response.json({ success: false, message: "No data found" });
  }
}
