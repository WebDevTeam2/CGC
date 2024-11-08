import Link from "next/link";
import Footer from "@/app/Components/Footer";
import GameDets from "@/app/Components/Game-components/GameDets";
import UserReviews from "@/app/Components/Game-components/UserReviews";
import NavBar from "@/app/Components/Game-components/NavBar";
import SearchBar from "@/app/Components/Game-components/SearchBar";
import { fetchAndCombineDataSimple } from "@/app/Game Collection/functions";

export default async function Games({ params }: { params: any }) {
  const gameData = await fetchAndCombineDataSimple();
  return (
    <div>
      <NavBar />
      <SearchBar games={gameData} />
      <div className="bg-stone-700 z-0 bg-cover fixed h-screen w-screen"></div>
      <GameDets params={params} />
      <UserReviews params={params} />
      <Footer />
    </div>
  );
}
