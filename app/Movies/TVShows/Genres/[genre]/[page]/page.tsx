import Image from "next/legacy/image";
import Link from "next/link";
import GenrePages from "@/app/components/Movie-components/GenrePages";
import Filter from "@/app/components/Movie-components/Filter";
import TvFilter from "@/app/components/Movie-components/TvFilter";
import TvGenrePages from "@/app/components/Movie-components/TvGenrePages";
import { getVotecolor, options } from "@/app/constants/constants";

const baseUrl = "https://api.themoviedb.org/3/";
const imageURL = "https://image.tmdb.org/t/p/w500";

interface Tv {
  page: number;
  results: TvResult[];
}

interface TvResult {
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

const getTVShowData = async (page: string, genre: string) => {
  const res = await fetch(
    `${baseUrl}discover/tv?include_adult=false&page=${page}&with_genres=${genre}&sort_by=popularity.desc&vote_count.gte=30&with_original_language=en&${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data;
};


const FilteredByGenre = async ({
  params,
}: {
  params: { genre: string; page: string };
}) => {
  const tvShowData: Tv = await getTVShowData(`${params.page}`, params.genre);
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden">
      <TvFilter />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search shows-grid">
        {/* Kanw Link oloklhrh th kartela */}
        {tvShowData.results
          .filter((item) => item.first_air_date <= currentDate)
          .map((item) => (
            <Link
              key={item.id}
              href={`/Movies/TVShows/${item.id}`}
              className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out mb-6 card-link"
            >
              <div className="flex flex-col items-center">
                {/* image dipla apo ta images me ta noumera */}
                <div className="relative w-full h-56 sm:h-56 lg:h-96">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full absolute"
                    priority
                  />
                </div>
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
          ))}
      </div>
      <div className="">
        <TvGenrePages />
      </div>
    </div>
  );
};

export default FilteredByGenre;
