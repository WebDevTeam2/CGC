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
      <div className="bg-[url('https://img.freepik.com/free-photo/3d-rendering-hexagonal-texture-background_23-2150796421.jpg?t=st=1734181088~exp=1734184688~hmac=67b5c36d583dffaeca547f04e9c70455b5d4c4813ced5a85e9239922e34757dc&w=1380')] z-0 bg-cover fixed h-screen w-screen"></div>
      <GameDets params={params} />
      <UserReviews params={params} />
      <Footer />
    </div>
  );
}
