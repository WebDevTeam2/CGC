// 1 = pc
// 2 = playstation
// 3 = xbox
// 7 = nintendo
// Import necessary dependencies
import {
  fetchAndCombineData,
  paginateGames,
  fetchGameDetails,
} from "@/app/utils/heplers";
import Link from "next/link";
import Image from "next/image";
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

// interface Post {
//   page: number;
//   results: PostResult[];
//   onSearch: (name: string) => void;
//   key: number;
// }

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

const Posts = async ({ params }: { params: any }) => {
  const gameData = await fetchAndCombineData(params.name);
  const updatedGameData = sortGamesByRelease(gameData);
  const paginatedGames = paginateGames(updatedGameData, params.page, pageSize);

  // Extract and flatten platforms, ensuring they are unique
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
        {/* <Sort /> */}
        <ul className="relative flex mt-12 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
          {detailedGames.map(
            (item) =>
              item.description_raw && (
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

// pages/games/[slug].tsx

// import { GetServerSideProps } from "next";

// type Game = {
//   id: number;
//   name: string;
//   // add more fields as needed
// };

// type Props = {
//   games: Game[];
//   slug: string;
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { slug } = context.params;

//   // Map slugs to platform IDs
//   const platformMap = {
//     xbox: 3,
//     playstation: 2,
//     nintendo: 7,
//     pc: 1,
//   };

//   const platformId = platformMap[slug as keyof typeof platformMap];

//   // Fetch games from the RAWG API
//   const res = await fetch(
//     `https://api.rawg.io/api/games?key=076eda7a1c0e441eac147a3b0fe9b586&platforms=${platformId}`
//   );
//   const data = await res.json();

//   return {
//     props: {
//       games: data.results,
//       slug,
//     },
//   };
// };

// const GamesPage = ({ games, slug }: Props) => {
//   return (
//     <div>
//       <h1>Games for {slug}</h1>
//       <ul>
//         {games.map((game) => (
//           <li key={game.id}>{game.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default GamesPage;
