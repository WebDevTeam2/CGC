// pages/api/users/[userid].ts
import { removeGame } from "@/app/collection/connection";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const { userid, gameId } = await req.json();

  try {
    // Find the user by ID and delete them
    const removedGame = await removeGame(userid, gameId);

    if (!removedGame) {
      return Response.json({ success: false, message: "Game not found" });
    }

    return Response.json({
      success: true,
      message: "Game removed successfully",
    });
  } catch (error) {
    console.error("Failed to remove game:", error);
    return Response.json({ success: false, message: "Failed to remove game" });
  }
}
