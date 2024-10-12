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

  const imageSizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";
  return (
    <div>
      <MainPage>
        <NavBar parent_platforms={platforms} />
        <SearchBar games={gameData} />
        <SortConsole currentName={params.name} />
        <GenresConsole genres={genres} currentName={params.name} />
        <ul className="relative flex mt-6 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
          {paginatedGames.map(
            (item) =>
              item.description_raw && (
                <li
                  key={item.id}
                  className="text-slate-200 text-balance text-xl hover:scale-110 xl:w-3/5 md:w-4/5 w-4/5 transition-all duration-500 ease-in-out"
                >
                  <Link
                    href={`/Games/${item.slug}`}
                    className="relative flex group border-2 md:h-60 h-[35rem] max-[450px]:h-[25rem] border-white rounded-lg transition-all duration-300"
                  >
                    <div className="bg-black overflow-hidden rounded-lg bg-opacity-[.7] relative flex flex-col md:flex-row md:gap-0 gap-0 transition-all duration-400">
                      <div className="relative md:pr-52 md:pl-52 md:pt-0 pt-80 max-[550px]:pt-56 max-[400px]:pt-40">
                        <Image
                          src={item.background_image}
                          alt={item.name}
                          fill={true}
                          sizes={imageSizes}
                          className="md:border-r-4 object-cover border-none rounded-l-lg border-white transition duration-500 ease-in-out"
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
                      <div className="overflow-hidden md:pl-4 pl-4 pt-1  leading-8 md:text-start ">
                        <span className="">{item.description_raw}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
          )}
        </ul>
        <Buttons gamesLength={gameData.length} />
      </MainPage>
    </div>
  );
};
// Export the Posts component
export default Posts;
