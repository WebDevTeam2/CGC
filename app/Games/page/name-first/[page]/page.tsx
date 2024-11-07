import React from "react";
import Buttons from "@/app/Components/Game-components/Buttons";
import MainPage from "@/app/Components/Game-components/MainPage";
import NavBar from "@/app/Components/Game-components/NavBar";
import SearchBar from "@/app/Components/Game-components/SearchBar";
import { pageSize } from "@/app/Constants/constants";
import {
  paginateGames,
  fetchGameDetails,
  fetchByName,
  extractGenres,
} from "@/app/Game Collection/functions";
import Sort from "@/app/Components/Game-components/Sort";
import Genres from "@/app/Components/Game-components/Genres";
import GameList from "@/app/Components/Game-components/GameList";
import Footer from "@/app/Components/Footer";

const Posts = async ({ params }: { params: any }) => {
  try {
    const gameData = await fetchByName();
    const genres = await extractGenres();
    const paginatedGames = paginateGames(gameData, params.page, pageSize);

    //fetch game description only for the paginated games not for all the games
    const detailedGames = await Promise.all(
      paginatedGames.map((item) => fetchGameDetails(item))
    );

    return (
      <div>
        <MainPage>
          <NavBar />
          <SearchBar games={gameData} />
          <Sort />
          <Genres genres={genres} />
          <GameList paginatedGames={detailedGames} />
          <Buttons
            link={`/Games/page`}
            page={Number(params.page)}
            gamesLength={gameData.length}
          />
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
