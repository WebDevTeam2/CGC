import { getVotecolor, imageURL, TVShowProps } from "@/app/Constants/constants";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import AddToWatchlist from "./AddToWatchlist";

const TVShowCards = ({ tvShowData, upcoming }: TVShowProps) => {
  const currentDate = new Date().toISOString().split("T")[0];

  return upcoming ? (
    <>
    
      {tvShowData.results.map((item) => (
        <Link
          key={item.id}
          href={`/Movies/TVShows/${item.id}`}
          className="hover:scale-110 hover:z-9 md:hover:border lg:hover:border md:hover:shadow-2xl lg:hover:shadow-2xl card-link lg:hover:shadow-gray-600 md:hover:shadow-gray-600 transition w-[90%] md:w-full lg:w-full h-1/2 md:h-full lg:h-full md:mb-0 lg:mb-0 duration-500 ease-in-out"
        >
          {/* Container for the image and content */}
          <div className="flex flex-col items-center">
            {/* Image container */}
            <div className="relative w-full h-56 sm:h-56 lg:h-96">
              <img
                src={`${imageURL}${item.poster_path}`}
                alt={item.name}
                className="absolute w-full h-full object-cover"
              />
            </div>

            {/* Text container */}
            <div className="bg-[#4c545b] w-full h-44 gap-4 p-4 card-text-container">
              <div className="flex justify-between text-white">
                <h2 className="lg:text-xl">{item.name}</h2>
              </div>
              <p className="mt-4 text-white">{item.overview.slice(0, 40)}...</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  ) : (
    <>
      {tvShowData.results
        .filter((item) => item.first_air_date <= currentDate)
        .map((item) => (
          <div
            key={item.id}
              className="hover:scale-110 hover:z-9 hover:border hover:shadow-2xl card-link hover:shadow-gray-600 transition w-[90%] md:w-full lg:w-full h-1/2 md:h-full lg:h-full mb-52 md:mb-0 lg:mb-0 duration-500 ease-in-out"
          >
            {/* Image container */}
            <Link href={`/Movies/TVShows/${item.id}`}>
            <div className="w-full h-full md:w-full md:h-64 lg:w-full lg:h-96 relative">
                <img
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.name}
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </Link>

            {/* Text container */}
            <div className="bg-[#4c545b] flex flex-col md:h-44 lg:h-52 cards h-full card-text-container">
              <Link
                href={`/Movies/TVShows/${item.id}`}
                className="flex lg:ml-4 h-10 text-white justify-between"
              >
                <div className="w-[55%]">
                  <h2 className="lg:text-xl">{item.name}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`${getVotecolor(item.vote_average)}`}>
                    {item.vote_average.toString().slice(0, 3)}
                  </span>
                  <FaStar color="gold" style={{ marginTop: "3px" }} />
                </div>
              </Link>
              {/* watchlist and review container */}
              <div className="movies-buttons-container flex flex-col justify-center gap-4">
                <div className="flex justify-center mt-4 ml-[-2rem]">
                  <AddToWatchlist id={item.id} media_type="tv" />
                </div>
                <span className="text-white justify-center text-center">
                  <Link href={`/Movies/TVShows/${item.id}/reviews`}>
                    Review
                  </Link>
                </span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default TVShowCards;
