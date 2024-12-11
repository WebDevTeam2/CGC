

import { baseUrl, options } from "@/app/Constants/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {tvShowId: string}}) {
  try {
    const {tvShowId} = params;
    if (!tvShowId) {
      return NextResponse.json(
        { message: "Show ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${baseUrl}tv/${tvShowId}?${process.env.MOVIE_API_KEY}`,
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
