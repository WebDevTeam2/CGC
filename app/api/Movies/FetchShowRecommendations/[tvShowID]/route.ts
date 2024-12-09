import { baseUrl, options } from "@/app/Constants/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { tvShowID: string } }
) {
  try {
    const { tvShowID } = params;
    if (!tvShowID) {
      return NextResponse.json(
        { message: "Movie ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${baseUrl}/tv/${tvShowID}/recommendations?include_adult=false&language=en-US&page=1&${process.env.MOVIE_API_KEY}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { message: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
