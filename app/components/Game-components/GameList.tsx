import Link from "next/link";
import React from "react";
import { FaStar } from "react-icons/fa";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
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
  metacritic: number;
  description: string;
  description_raw: string;
  parent_platforms: Platform[];
}

interface GameListProps {
  paginatedGames: PostResult[];
}

const GameList: React.FC<GameListProps> = ({ paginatedGames }) => {
  return (
    <ul className="relative pointer-events-none flex mt-6 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
      {paginatedGames.map(
        (item, index) =>
          item.description_raw && (
            <li
              key={`${item._id}-${index}`}
              className="text-slate-200 pointer-events-auto text-balance text-lg hover:scale-105 xl:w-3/5 md:w-4/5 w-4/5 transition-all duration-500 ease-in-out"
            >
              <Link
                href={`/Games/${item.slug}`}
                className="relative flex group border-2 md:h-60 h-[32rem] max-[550px]:h-[25rem] border-white rounded-lg transition-all duration-300"
              >
                <div className="bg-black overflow-hidden rounded-lg bg-opacity-[.7] relative flex flex-col md:flex-row md:gap-0 gap-0 transition-all duration-400">
                  <div className="relative md:w-[25rem] md:h-[15rem] w-full h-[20rem] max-[550px]:h-[15rem] max-[416px]:h-[10rem] flex-shrink-0 flex-grow-0">
                    <img
                      src={item.background_image}
                      alt={item.name}
                      className="w-full h-full md:border-r-4 object-cover border-none rounded-l-lg border-white transition duration-500 ease-in-out"
                    />
                  </div>
                  {/* Item name on hover */}
                  <div
                    className="
                    h-10 opacity-100
                    md:h-0 md:opacity-0 md:group-hover:opacity-100 
                    md:group-hover:h-10 md:max-w-80 min-[550px]:max-w-60 max-w-48
                    absolute flex items-center border border-black bg-black md:rounded-b-xl rounded-br-xl text-md max-[440px]:text-sm md:ml-3 ml-0 p-1
                    transition-all duration-500 ease-in-out
                  "
                  >
                    <span className="text-white truncate">{item.name}</span>
                  </div>
                  <div className="overflow-hidden md:pl-4 pl-4 pt-1 leading-7 md:text-start">
                    <span>{item.description_raw}</span>
                  </div>
                  <div className="absolute gap-1 md:left-0 right-0 md:bottom-0 min-[550px]:bottom-[29.3rem] min-[440px]:bottom-[22.3rem] bottom-0 flex h-10 w-24 justify-center items-center md:border min-[440px]:border-0 border border-white bg-black md:rounded-tr-xl min-[440px]:rounded-bl-xl rounded-tl-xl text-md max-[440px]:text-sm">
                    <span className="text-stone-200">{item.rating} / 5</span>
                    <FaStar color="yellow" />
                  </div>
                </div>
              </Link>
            </li>
          )
      )}
    </ul>
  );
};

export default GameList;
