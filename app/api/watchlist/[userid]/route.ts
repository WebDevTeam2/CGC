import { baseUrl } from "@/app/Constants/constants";
import { addToWatchlist, findUserById } from "@/app/User Collection/connection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userid: string } }
) {
  const userid = params.userid;
  try {
    const { id, media_type } = await req.json();

    if (!id || !media_type) {
      return NextResponse.json(
        { message: "Both id and type are required." },
        { status: 400 }
      );
    }
    // Now proceed with the logic to add the movie to the user's watchlist
    await addToWatchlist(userid, {id, media_type});

    return NextResponse.json({ message: "Item added to watchlist" });
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
    if (!user || !user.watchlist || user.watchlist.length === 0) {
      return NextResponse.json({ message: "No movies in the watchlist" });
    }

    // Fetch details for each item in the watchlist
    const mediaDetails = await Promise.all(
      user.watchlist.map(async (item: { id: number; media_type: string }) => {
        const res = await fetch(
          `${baseUrl}${item.media_type}/${item.id}?${process.env.MOVIE_API_KEY}`
        );

        if (!res.ok) {
          console.error(`Failed to fetch details for ${item.media_type}/${item.id}`);
          return null;
        }

        const data = await res.json();
        const dataWithMediaType = {
          ...data,
          media_type: item.media_type,
        };

        return dataWithMediaType;
      })
    );

    // Filter out any null responses due to failed fetches
    const validMediaDetails = mediaDetails.filter(Boolean);

    return NextResponse.json({ watchlist: validMediaDetails });
  } catch (error) {
    console.error("Error fetching watchlist details:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}