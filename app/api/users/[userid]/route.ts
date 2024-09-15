import connect from "@/app/utils/connectdb/dbconnect";
import User from "@/app/utils/Schema/userSchema";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function GET(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const result = await User.findOne({ _id: userid });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ success: false, message: "No data found" });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  const { username, email } = await req.json();
  try {
    const result = await User.findOneAndUpdate(
      { _id: userid },
      { username, email }
    );
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ success: false, message: "No data found" });
  }
}
