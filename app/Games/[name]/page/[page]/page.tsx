// 1 = pc
// 2 = playstation
// 3 = xbox
// 7 = nintendo
// Import necessary dependencies
import {
  extractPlatformFromUrl,
  fetchAndCombineData,
  paginateGames,
} from "@/app/utils/heplers";
import Link from "next/link";
import Image from "next/image";
import Sort from "@/app/components/Game-components/Sort";
import Buttons from "@/app/components/Game-components/Buttons";
import MainPage from "@/app/components/Game-components/MainPage";
import NavBar from "@/app/components/Game-components/NavBar";
import SearchBar from "@/app/components/Game-components/SearchBar";
import { pageSize } from "@/app/constants/constants";

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
  selectedPlatformKey: number | null;
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
  parent_platforms: Platform[];
}

const Posts = async ({ params }: { params: Post }) => {
  // this part uses headers to get the current url
  // const headersList = headers();
  // // read the custom x-url header
  // const pathname = headersList.get("x-url") || "";
  // console.log(pathname);
  const pathname = "http://localhost:3000/Games/playstation/page/1";
  const value = extractPlatformFromUrl(pathname);
  console.log(value);

  const gameData = await fetchAndCombineData(value);
  const paginatedGames = paginateGames(gameData, params.page, pageSize);
  // Extract and flatten platforms, ensuring they are unique
  const platforms = Array.from(
    new Set(
      gameData.flatMap((game) =>
        game.parent_platforms.map((p) => JSON.stringify(p.platform))
      )
    )
  ).map((str) => ({ platform: JSON.parse(str) }));
  return (
    <div>
      <MainPage>
        <NavBar parent_platforms={platforms} />
        <SearchBar games={gameData} />
        {/* <Sort /> */}
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
};
// Export the Posts component
export default Posts;

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
