import Link from "next/link";
import Image from "next/image";
import React from "react";
import Sort from "@/app/components/Game-components/Sort";
import Buttons from "@/app/components/Game-components/Buttons";
import MainPage from "@/app/components/Game-components/MainPage";
import NavBar from "@/app/components/Game-components/NavBar";
import SearchBar from "@/app/components/Game-components/SearchBar";
import { pageSize } from "@/app/constants/constants";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}
interface Post {
  page: number;
  results: PostResult[];
  onSearch: (name: string) => void;
}

interface PostResult {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  description: string;
  description_raw: string;
  parent_platforms: Platform[];
}
// https://api.rawg.io/api/games?key=f0e283f3b0da46e394e48ae406935d25
const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=75cb8e3e3c904ccfbe1741d5fcef068b";
const apiPosterUrl = `${basePosterUrl}?${apiPosterKey}`;

const getGameData = async (url: string, page: number) => {
  try {
    const res = await fetch(`${url}&page=${page}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data.results) {
      throw new Error("Invalid data structure");
    }
    return data.results;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

const fetchGameDetails = async (game: PostResult) => {
  try {
    const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
    if (!gameRes.ok) {
      throw new Error(`HTTP error! status: ${gameRes.status}`);
    }
    const gameData = await gameRes.json();
    // console.log(gameData.description_raw);
    return { ...game, description_raw: gameData.description_raw };
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};

// Function to shuffle an array
// T is used for any type
const shuffleArray = <T,>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// In-memory cache for the shuffled data
let cachedShuffledGames: PostResult[] | null = null;

const fetchAndCombineData = async () => {
  const currentYear: number = new Date().getFullYear();
  const startYear: number = 2005;
  const endYear: number = currentYear;
  const dateRanges: string[] = [];

  // Create an array of date ranges (e.g., every 5 years)
  for (let year = startYear; year <= endYear; year += 5) {
    const endRangeYear = Math.min(year + 4, endYear);
    dateRanges.push(`${year}-01-01,${endRangeYear}-12-31`);
  }

  const allGames: PostResult[] = [];

  // Fetch and combine data for each date range
  for (const dateRange of dateRanges) {
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const dateRangeUrl = `${apiPosterUrl}&dates=${dateRange}`;
        const gameResults = await getGameData(dateRangeUrl, page);

        // Check if there are results to add
        if (gameResults.length > 0) {
          allGames.push(...gameResults);
          page += 1; // Increment page for next fetch
        } else {
          hasMoreData = false; // No more data available, exit loop
        }
      } catch (error) {
        console.error(`Error fetching data for range ${dateRange}:`, error);
        // Handle error or break the loop
        hasMoreData = false;
      }
    }
  }

  // console.log("Fetched all games:", allGames);
  return allGames;
};

//specifying the page size for the page results
const paginateGames = (games: PostResult[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return games.slice(start, end);
};

// this function is used to cache data
const getShuffledGameData = async () => {
  try {
    if (!cachedShuffledGames) {
      const gameData = await fetchAndCombineData();
      // shuffleArray(gameData);
      cachedShuffledGames = gameData;
    }
    return cachedShuffledGames;
  } catch (error) {
    console.error("Error fetching shuffled game data:", error);
    throw error;
  }
};

const Posts = async ({ params }: { params: Post }) => {
  try {
    const gameData = await getShuffledGameData();
    const paginatedGames = paginateGames(gameData, params.page, pageSize);

    const platforms = Array.from(
      new Set(
        gameData.flatMap((game) =>
          game.parent_platforms.map((p) => JSON.stringify(p.platform))
        )
      )
    ).map((str) => ({ platform: JSON.parse(str) }));

    //fetch game description only for the paginated games not for all the games
    const detailedGames = await Promise.all(
      paginatedGames.map((item) => fetchGameDetails(item))
    );

    return (
      <div>
        <MainPage>
          <NavBar parent_platforms={platforms} />
          <SearchBar games={gameData} />
          {/* <Sort games={gameData} onSorted={handle} /> */}
          <ul className="relative flex mt-12 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
            {detailedGames.map((item) => (
              <li
                key={item.id}
                className="text-slate-200 text-balance text-xl hover:scale-110 xl:w-3/5 w-4/5  transition-all duration-500 ease-in-out"
              >
                <Link
                  href={`/Games/${item.slug}`}
                  className="relative flex group border-2 md:h-60 h-[33rem] border-white rounded-lg transition-all duration-300"
                >
                  <div className="bg-black rounded-lg bg-opacity-[.7] relative flex flex-col md:flex-row md:gap-0 gap-2 transition-all duration-400">
                    <div className="relative overflow-hidden md:pb-56 pb-72 md:pr-96">
                      <Image
                        src={item.background_image}
                        alt={item.name}
                        fill={true}
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="border-r-4 rounded-l-lg border-white transition duration-500 ease-in-out"
                      />
                    </div>
                    {/* item name on hover */}
                    <div
                      className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 max-w-80 items-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                      style={{
                        transition:
                          "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                      }}
                    >
                      <span className="text-white truncate">{item.name}</span>
                    </div>
                    <div className="overflow-hidden pl-4 pt-3 leading-9 ">
                      <span className="">{item.description_raw}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Buttons gamesLength={gameData.length} />
        </MainPage>
      </div>
    );
  } catch (error) {
    console.log("Error fetching render:", error);
    return <div>Error fetching game data</div>;
  }
};
// Export the Posts component
export default Posts;
