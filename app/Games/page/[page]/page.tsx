// Import necessary dependencies
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Sort from "@/app/components/Game-components/Sort";
import Buttons from "@/app/components/Game-components/Buttons";
import MainPage from "@/app/components/Game-components/MainPage";
import NavBar from "@/app/components/Game-components/NavBar";
import SearchBar from "@/app/components/Game-components/SearchBar";
import { pageSize } from "@/app/constants/constants";

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
}
// https://api.rawg.io/api/games?key=f0e283f3b0da46e394e48ae406935d25
const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=f0e283f3b0da46e394e48ae406935d25";
const apiPosterUrl = `${basePosterUrl}?${apiPosterKey}&platforms=1,4,7,18,187,186`;

//this function uses regex to replace html tags inside the description
const stripHtmlTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi;
  const regex2 = /&#?\w+;/gi;
  return html.replace(regex, "").replace(regex2, "'");
};

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

    const gameDetailsPromises = data.results.map(async (game: PostResult) => {
      const gameRes = await fetch(
        `${basePosterUrl}/${game.id}?${apiPosterKey}`
      );
      if (!gameRes.ok) {
        throw new Error(`HTTP error! status: ${gameRes.status}`);
      }
      const gameData = await gameRes.json();
      // const strippedDescription = stripHtmlTags(gameData.description);
      return { ...game, description_raw: gameData.description_raw };
    });

    const gameDetails = await Promise.all(gameDetailsPromises);
    return { ...data, results: gameDetails };
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

//function to sort the games based on their rating
const sortGamesByRating = (games: PostResult[]) => {
  return games.sort((a, b) => b.rating - a.rating);
};

//function to sort the games based on their release
const sortGamesByRelease = (games: PostResult[]) => {
  return games.sort((a, b) => {
    const dateA = new Date(a.released);
    const dateB = new Date(b.released);
    return dateB.getTime() - dateA.getTime();
  });
};

//mapping through all games to render the most known ones
const fetchAndCombineData = async () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2005; // Starting year
  const endYear = currentYear; // Ending year
  const topGamesPerYear = [];

  for (let year = endYear; year >= startYear; year--) {
    const yearUrl = `${apiPosterUrl}&dates=${year}-01-01,${year}-12-31`;
    const gameData: Post = await getGameData(yearUrl, 1);
    const top10Games = gameData.results.slice(0, 15);
    topGamesPerYear.push(...top10Games);
  }

  return topGamesPerYear;
};

//specifying the page size for the page results
const paginateGames = (games: PostResult[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return games.slice(start, end);
};

const Posts = async ({ params }: { params: Post }) => {
  try {
    const gameData = await fetchAndCombineData();
    const paginatedGames = paginateGames(gameData, params.page, pageSize);

    // Render the component
    return (
      <div>
        <MainPage>
          <NavBar />
          <SearchBar games={gameData} />
          <Sort />
          <ul className="relative flex mt-12 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
            {paginatedGames.map((item) => (
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
                        loading="lazy"
                        style={{ objectFit: "cover" }}
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
    console.log("Error fetching game data:", error);
    return <div>Error fetching game data</div>;
  }
};
// Export the Posts component
export default Posts;
