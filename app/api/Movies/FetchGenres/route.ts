import { options } from "@/app/Constants/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=en&${process.env.MOVIE_API_KEY}`, options
    );

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return NextResponse.json("Error fetching movie genres", { status: 500 });
  }
}
