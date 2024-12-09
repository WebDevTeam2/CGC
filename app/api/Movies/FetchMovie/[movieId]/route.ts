

import { baseUrl, options } from "@/app/Constants/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {movieId: string}}) {
  try {
    const {movieId} = params;
    if (!movieId) {
      return NextResponse.json(
        { message: "Movie ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${baseUrl}movie/${movieId}?api_key=${process.env.MOVIE_API_KEY}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { message: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}
