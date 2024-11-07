// 1 = pc
// 2 = playstation
// 3 = xbox
// 7 = nintendo
// Import necessary dependencies
import {
  fetchAndCombineData,
  paginateGames,
  fetchGameDetails,
  extractGenres,
  sortGamesByRelease,
} from "@/app/Game Collection/functions";
import Buttons from "@/app/Components/Game-components/Buttons";
import MainPage from "@/app/Components/Game-components/MainPage";
import NavBar from "@/app/Components/Game-components/NavBar";
import SearchBar from "@/app/Components/Game-components/SearchBar";
import { pageSize } from "@/app/Constants/constants";
import SortConsole from "@/app/Components/Game-components/SortConsole";
import GenresConsole from "@/app/Components/Game-components/GenresConsole";
import GameList from "@/app/Components/Game-components/GameList";
import Footer from "@/app/Components/Footer";

const Posts = async ({ params }: { params: any }) => {
  const gameData = await fetchAndCombineData(params.name);

  const genres = await extractGenres();

  const platforms = Array.from(
    new Set(
      gameData.flatMap((game) =>
        game.parent_platforms.map((p) => JSON.stringify(p.platform))
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
        <Footer />
      </MainPage>
    </div>
  );
};
// Export the Posts component
export default Posts;
