import {
  getVotecolor,
  imageURL,
  Movie,
  MovieProps,
} from "@/app/Constants/constants";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import AddToWatchlist from "./AddToWatchlist";

const Cards = ({ movieData, upcoming, movieResultData }: MovieProps ) => {
  const currentDate = new Date().toISOString().split("T")[0];
  return upcoming && movieResultData ? (
    <>
      {movieResultData.map((item) => (
        <Link
          key={item.id}
          href={`/Movies/${item.id}`}
          className="lg:hover:scale-110 lg:w-full md:w-[90%] h-full transition duration-700 ease-in-out mb-6 card-link "
        >
          {/* Container for the image and content */}
          <div className="flex flex-col items-center">
            {/* Image container */}
            <div className="relative w-full h-56 sm:h-56 lg:h-96">
              <img
                src={`${imageURL}${item.poster_path}`}
                alt={item.title}
                className="absolute w-full h-full object-cover"
              />
            </div>

            {/* Text container */}
            <div className="bg-[#4c545b] w-full h-44 gap-4 p-4 card-text-container">
              <div className="flex justify-between text-white">
                <h2 className="lg:text-xl">{item.title}</h2>
              </div>
              <p className="mt-4 text-white">{item.overview.slice(0, 40)}...</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  ) : (
    <>
      {movieData?.results
        .filter((item) => item.release_date <= currentDate)
        .map((item) => (
          <div
            key={item.id}
            className="hover:scale-110 hover:border hover:shadow-2xl card-link hover:shadow-gray-600 transition w-[90%] md:w-full lg:w-full h-1/2 md:h-full lg:h-full mb-52 md:mb-0 lg:mb-0 duration-500 ease-in-out"
          >
            {/* Image container */}
            <Link href={`/Movies/${item.id}`}>
              {/* p-10 */}
              <div className="w-full h-full md:w-full md:h-64 lg:w-full lg:h-96 relative">
                <img
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.title}
                  // layout="fill"
                  // objectFit="cover"
                  className="absolute w-full h-full object-cover"
                  // priority
                />
              </div>
            </Link>

            {/* Text container */}
            <div className="bg-[#4c545b] flex flex-col md:h-44 lg:h-52 cards h-full card-text-container">
              <Link
                href={`/Movies/${item.id}`}
                className="flex lg:ml-4 h-10 text-white justify-between"
              >
                <div className="w-[55%]">
                <h2 className="lg:text-xl">{item.title}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`${getVotecolor(item.vote_average)}`}>
                    {item.vote_average.toString().slice(0, 3)}
                  </span>
                  <FaStar color="yellow" style={{ marginTop: "3px" }} />
                </div>
              </Link>
              {/* watchlist and review container */}
              <div className="movies-buttons-container h-full flex flex-col justify-center gap-4">
                <div className="flex justify-center mt-4 ml-[-2rem]">
                  <AddToWatchlist movieId={item.id} />
                </div>
                <span className="text-white justify-center text-center">
                  <Link href={`/Movies/${item.id}/reviews`}>Review</Link>
                </span>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Cards;
