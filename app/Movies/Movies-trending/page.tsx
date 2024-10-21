import Link from "next/link";
import Image from "next/legacy/image";
import { ImTv } from "react-icons/im";
import { FaStar } from "react-icons/fa";
import Filter from "@/app/components/Movie-components/Filter";
import AddToWatchlist from "@/app/components/Movie-components/AddToWatchlist";

const baseUrl = "https://api.themoviedb.org/3/";
const ApiURL =
  baseUrl + "trending/movie/day?page=1&language=en-US&" + process.env.API_KEY;
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 1000 },
};

interface Movie {
  page: number;
  results: MovieResult[];
}

interface MovieResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const getMovieData = async (url: string) => {
  const res = await fetch(url, options);
  const data = await res.json();
  return data;
};

const getVotecolor = (vote: number) => {
  if (vote >= 7) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

const Trending = async () => {
  const movieData: Movie = await getMovieData(ApiURL);
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="flex justify-end mr-10 mt-2">
        <Link
          href={"/Movies/TVShows/Trending"}
          className="flex flex-row gap-2 mt-2 items-center justify-end p-2 rounded hover:opacity-85 transition duration-200 bg-[#4c545b] cursor-pointer text-[#d1d1d1] not-search trending-button"
        >
          <ImTv style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          <span>TV Shows</span>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 w-3/4 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
        {/* Check gia ama exei kykloforisei h tainia akoma */}
        {movieData.results
          .filter((item) => item.release_date <= currentDate)
          .map((item) => (
            <div
              key={item.id}
              className="lg:hover:scale-110 md:hover:scale-110 md:hover:border md:hover:shadow-2xl md:hover:shadow-gray-600 lg:hover:border lg:hover:shadow-2xl lg:hover:shadow-gray-600 w-full transition card-link duration-500 ease-in-out mb-6"
            >
              {/* image container */}
              <Link href={`/Movies/${item.id}`}>
                <div className="card-image-container sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute w-full h-full"
                    priority
                  />
                </div>
              </Link>
              {/* Text container */}
              <div className="bg-[#4c545b] flex flex-col h-44 cards card-text-container">
                <Link
                  href={`/Movies/${item.id}`}
                  className="flex lg:ml-4 h-10 text-white justify-between"
                >
                  <div className="card-title-container">
                    <h2>{item.title}</h2>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${getVotecolor(item.vote_average)}`}>
                      {item.vote_average.toString().slice(0, 3)}
                    </span>
                    <FaStar color="yellow" />
                  </div>
                </Link>
                {/* watchlist and review container */}
                <div className="movies-buttons-container md:mt-6 flex flex-col justify-center gap-4">
                  <div className="flex justify-center mt-4 ml-[-2rem]">
                    <AddToWatchlist movieId={item.id} />
                  </div>
                  <span className="text-white justify-center text-center">
                    Review
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Trending;
