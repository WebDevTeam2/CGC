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
  extractGenres,
  fetchByGenreRating,
} from "@/app/Game Collection/functions";
import SortGenres from "@/app/Components-2/Game-components/SortGenres";
import Genres from "@/app/Components-2/Game-components/Genres";
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

//function to sort the games based on their release
const sortGamesByRelease = (games: PostResult[]) => {
  return games.sort((a, b) => {
    const dateA = new Date(a.released);
    const dateB = new Date(b.released);
    return dateB.getTime() - dateA.getTime();
  });
};

const Posts = async ({ params }: { params: any }) => {
  try {
    const gameData = await fetchByGenreRating(params.slug);
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
          <SortGenres currentName={params.slug} />
          <Genres genres={genres} />
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
