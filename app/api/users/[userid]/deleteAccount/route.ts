// pages/api/users/[userid].ts
import { deleteUserById } from "@/app/User Collection/connection";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const { userid } = await req.json();

  try {
    // Find the user by ID and delete them
    const deletedUser = await deleteUserById(userid);

    if (!deletedUser) {
      return Response.json({ success: false, message: "User not found" });
    }

    return Response.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return Response.json({ success: false, message: "Failed to delete user" });
  }
}
