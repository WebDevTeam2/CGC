import { addToWatchlist } from "@/app/collection/connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const { movieId } = await req.json();
    console.log("Movie ID:", movieId); // This should log to the server console

    // Now proceed with the logic to add the movie to the user's watchlist
    await addToWatchlist(userid, movieId);

    return NextResponse.json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error("Error in add to watchlist:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}