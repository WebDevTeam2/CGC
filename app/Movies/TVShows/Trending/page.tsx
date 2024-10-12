import Link from "next/link";
import Image from "next/legacy/image";
import { GiFilmProjector } from "react-icons/gi";
import TvFilter from "@/app/components/Movie-components/TvFilter";

const baseUrl = "https://api.themoviedb.org/3/";
const ApiURL = baseUrl + "trending/tv/day?page=1&language=en-US&" + process.env.MOVIE_API_KEY;
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 43200 },
};

interface TVShow {
  page: number;
  results: TVShowResult[];
}

interface TVShowResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const getTVShowData = async (url: string) => {
  const res = await fetch(url, options);
  const data = await res.json();
  return data;
};

const getVotecolor = (vote: number) => {
  if (vote >= 8) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

const Trending = async () => {
  const tvShowData: TVShow = await getTVShowData(ApiURL);
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="overflow-hidden">
      <TvFilter />
      <div className="flex justify-end mr-10 mt-2">
        <Link
          href={"/Movies/Movies-trending"}
          className="flex flex-row gap-2 items-center hover:opacity-85 transition duration-200 justify-end p-2 rounded mt-2 cursor-pointer text-[#d1d1d1] bg-[#4c545b] not-search"
        >
          <GiFilmProjector style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          <span>Movies</span>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search shows-grid">
        {tvShowData.results.filter(item => item.first_air_date  <= currentDate).map(
          (item) =>
            item.overview && (
              <Link
                key={item.id}
                href={`/Movies/TVShows/${item.id}`}
                 className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out mb-6 card-link"
              >
                 {/* Container for the image and content */}
              <div className="flex flex-col items-center">
                {/* Image container */}
                <div className="relative w-full h-56 sm:h-56 lg:h-96">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="absolute w-full h-full"
                    priority
                  />
                </div>

                {/* Text container */}
                <div className="bg-[#4c545b] w-full h-44 gap-4 p-4">
                  <div className="flex justify-between text-white">
                    <h2>{item.name}</h2>
                    <span
                      className={`${getVotecolor(item.vote_average)} mt-auto`}
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
