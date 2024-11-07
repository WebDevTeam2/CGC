import Link from "next/link";
import Footer from "@/app/Components/Footer";
import GameDets from "@/app/Components/Game-components/GameDets";
import UserReviews from "@/app/Components/Game-components/UserReviews";

export default async function Games({ params }: { params: any }) {
  return (
    <div>
      <div className="bg-black z-0 bg-cover fixed h-screen w-screen"></div>
      <Link href={`/Games/page/1`} className="absolute pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      <GameDets params={params} />
      <UserReviews params={params} />
      <Footer />
    </div>
  );
}
