import { addToList } from "@/app/collection/connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const { gameId, gameName, gameDesc, date } = await req.json();
    console.log("Game ID:", gameId); // This should log to the server console

    // Now proceed with the logic to add the movie to the user's watchlist
    await addToList(userid, gameId, gameName, gameDesc, date);

    return NextResponse.json({ message: "Game added to Library" });
  } catch (error) {
    console.error("Error in addition to list:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}