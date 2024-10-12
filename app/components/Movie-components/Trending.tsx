import Link from "next/link";
import Image from "next/legacy/image";
import { ImTv } from "react-icons/im";
import Filter from "./Filter";

const baseUrl = "https://api.themoviedb.org/3/";
const ApiURL = baseUrl + "trending/movie/day?page=1&language=en-US&" + process.env.API_KEY;
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 43200 },
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
        {/* Check gia ama exei kykloforisei h tainia akoma */}
        {movieData.results
          .filter((item) => item.release_date <= currentDate)
          .map(
            (item) =>
              item.overview && (
                <Link
                  key={item.id}
                  href={`/Movies/${item.id}`}
                  className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out mb-6 card-link"
                >
                  {/* Container for the image and content */}
                  <div className="flex flex-col items-center">
                    {/* Image container */}
                    <div className="relative w-full h-56 sm:h-56 lg:h-96">
                      <Image
                        src={`${imageURL}${item.poster_path}`}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="absolute w-full h-full"
                        priority
                      />
                    </div>

                    {/* Text container */}
                    <div className="bg-[#4c545b] w-full h-44 gap-4 p-4">
                      <div className="flex justify-between text-white">
                        <h2>{item.title}</h2>
                        <span
                          className={`${getVotecolor(
                            item.vote_average
                          )} mt-auto`}
                        >
                          {item.vote_average.toString().slice(0, 3)}
                        </span>
                      </div>
                      <p className="mt-4 text-white">
                        {item.overview.slice(0, 40)}...
                      </p>
                    </div>
                  </div>
                </Link>
              )
          )}
      </div>
    </div>
  );
};

export default Trending;
