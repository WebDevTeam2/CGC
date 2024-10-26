// 1 = pc
// 2 = playstation
// 3 = xbox
// 7 = nintendo
// Import necessary dependencies
import {
  fetchAndCombineData,
  paginateGames,
  fetchGameDetails,
  shuffleArray,
  extractGenres,
  sortGamesByRelease,
} from "@/app/utils/functions";
import Link from "next/link";
import Image from "next/image";
import Buttons from "@/app/components/Game-components/Buttons";
import MainPage from "@/app/components/Game-components/MainPage";
import NavBar from "@/app/components/Game-components/NavBar";
import SearchBar from "@/app/components/Game-components/SearchBar";
import { pageSize } from "@/app/constants/constants";
import SortConsole from "@/app/components/Game-components/SortConsole";
import GenresConsole from "@/app/components/Game-components/GenresConsole";
import GameList from "@/app/components/Game-components/GameList";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

// interface Post {
//   page: number;
//   results: PostResult[];
//   onSearch: (name: string) => void;
//   key: number;
// }

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
  const gameData = await fetchAndCombineData(params.name);

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

  return (
    <div>
      <MainPage>
        <NavBar parent_platforms={platforms} />
        <SearchBar games={gameData} />
        <SortConsole currentName={params.name} />
        <GenresConsole genres={genres} currentName={params.name} />
        <GameList paginatedGames={paginatedGames} />
        <Buttons gamesLength={gameData.length} />
      </MainPage>
    </div>
  );
};
// Export the Posts component
export default Posts;
