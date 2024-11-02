import Link from "next/link";
import Image from "next/image";
import React from "react";
import Buttons from "@/app/Components-2/Game-components/Buttons";
import MainPage from "@/app/Components-2/Game-components/MainPage";
import NavBar from "@/app/Components-2/Game-components/NavBar";
import SearchBar from "@/app/Components-2/Game-components/SearchBar";
import { pageSize } from "@/app/Constants-2/constants";
import {
  paginateGames,
  fetchGameDetails,
  fetchByGenreConsoleName,
  extractGenres,
  fetchByGenreConsoleRating,
} from "@/app/Game Collection/functions";
import SortGenresConsole from "@/app/Components-2/Game-components/SortGenresConsole";
import GenresConsole from "@/app/Components-2/Game-components/GenresConsole";
import GameList from "@/app/Components-2/Game-components/GameList";
import Footer from "@/app/Components-2/Footer";

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
  _id: string;
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

const Posts = async ({ params }: { params: any }) => {
  try {
    const gameData = await fetchByGenreConsoleRating(params.name, params.slug);
    const genres = await extractGenres();
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
          <SortGenresConsole
            currentName={params.name}
            currentGenre={params.slug}
          />
          <GenresConsole genres={genres} currentName={params.name} />
          <GameList paginatedGames={detailedGames} />
          <Buttons gamesLength={gameData.length} />
          <Footer />
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
