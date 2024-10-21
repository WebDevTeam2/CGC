import Image from "next/legacy/image";
import { GiFilmProjector } from "react-icons/gi";
import Link from "next/link";
import UpComingTvShowsPages from "@/app/components/Movie-components/UpcomingTvShowsPages";
import TvFilter from "@/app/components/Movie-components/TvFilter";
import { options } from "@/app/constants/constants";

const baseUrl = "https://api.themoviedb.org/3/";
const imageURL = "https://image.tmdb.org/t/p/w500";

interface TVResult {
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

interface TVShows {
  page: number;
  results: TVResult[];
}

const getTvShowData = async (page: string) => {
  const res = await fetch(
    `${baseUrl}tv/airing_today?include_adult=false&page=${page}&${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data;
};

const UpComing = async ({ params }: { params: { page: string } }) => {
  const showData: TVShows = await getTvShowData(params.page.toString());

  return (
    <div className="overflow-hidden">
      <TvFilter />
      <div className="flex justify-end mr-10 mt-2">
        <Link
          href={"/Movies/Upcoming-Movies/1"}
          className="flex flex-row gap-2 mt-2 items-center justify-end p-2 rounded hover:opacity-85 transition duration-200 bg-[#4c545b] cursor-pointer text-[#d1d1d1] not-search trending-button"
        >
          <GiFilmProjector style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          <span>Movies</span>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search shows-grid">
        {showData.results.map((item) => (
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
                </div>
                <p className="mt-4 text-white">
                  {item.overview.slice(0, 40)}...
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <UpComingTvShowsPages />
      </div>
    </div>
  );
};

export default UpComing;
