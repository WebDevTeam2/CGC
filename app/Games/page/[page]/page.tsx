import Link from "next/link";
import Image from "next/image";
import React from "react";
import Buttons from "@/app/components/Game-components/Buttons";
import MainPage from "@/app/components/Game-components/MainPage";
import NavBar from "@/app/components/Game-components/NavBar";
import SearchBar from "@/app/components/Game-components/SearchBar";
import Genres from "@/app/components/Game-components/Genres";
import { pageSize } from "@/app/constants/constants";
import {
  fetchAndCombineDataSimple,
  paginateGames,
  fetchGameDetails,
  extractGenres,
  sortGamesByRelease,
} from "@/app/utils/functions";
import Sort from "@/app/components/Game-components/Sort";
import GameList from "@/app/components/Game-components/GameList";
import Footer from "@/app/components/Footer";

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

const Posts = async ({ params }: { params: Post }) => {
  try {
    const gameData = await fetchAndCombineDataSimple();

    const genres = await extractGenres();

    const platforms = Array.from(
      new Set(
        gameData.flatMap((game) =>
          game.parent_platforms.map((p: Platform) => JSON.stringify(p.platform))
        )
      )
    ).map((str) => ({ platform: JSON.parse(str) }));

    const descriptioned = await Promise.all(
      gameData.map((item) => fetchGameDetails(item))
    );

    sortGamesByRelease(descriptioned);

    const paginatedGames = paginateGames(descriptioned, params.page, pageSize);
    // Now paginate the unique games list

    return (
      <div>
        <MainPage>
          <NavBar parent_platforms={platforms} />
          <SearchBar games={gameData} />
          <Sort />
          <Genres genres={genres} />
          <GameList paginatedGames={paginatedGames} />
          <Buttons gamesLength={descriptioned.length} />
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
