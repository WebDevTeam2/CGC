import { baseUrl } from "@/app/Constants/constants";
import { addToWatchlist, findUserById } from "@/app/User Collection/connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const { movieId } = await req.json();

    // Now proceed with the logic to add the movie to the user's watchlist
    await addToWatchlist(userid, movieId);

    return NextResponse.json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error("Error in add to watchlist:", error);
    return NextResponse.json(
      { message: "You must be logged in to add movies to your watchlist" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;

  try {
    const user = await findUserById(userid);
    if (!user || !user.watchlist || user.watchlist.length === 0)
      return NextResponse.json({ message: "No movies in the watchlist" });

    const movieDetails = await Promise.all(
      user.watchlist.map(async (movieId: number) => {
        const res = await fetch(
          `${baseUrl}movie/${movieId}?${process.env.MOVIE_API_KEY}`
        );
        return res.json();
      })
    );
    return NextResponse.json({ movies: movieDetails });
  } catch (error) {
    console.error("Error in add to watchlist:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
