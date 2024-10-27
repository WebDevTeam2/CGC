import Link from "next/link";
import Image from "next/legacy/image";
import { GiFilmProjector } from "react-icons/gi";
import TvFilter from "@/app/components/Movie-components/TvFilter";
import { getVotecolor, options } from "@/app/constants/constants";
import TVShowCards from "@/app/components/Movie-components/TVShowCards";

const baseUrl = "https://api.themoviedb.org/3/";
const ApiURL = baseUrl + "trending/tv/day?page=1&language=en-US&" + process.env.MOVIE_API_KEY;
const imageURL = "https://image.tmdb.org/t/p/w500";

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
      <div className="grid grid-cols-2 mt-4 h-full not-search movies-grid gap-y-2 mx-auto w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 ">
       <TVShowCards tvShowData={tvShowData} />
      </div>
    </div>
  );
};

export default Trending;
