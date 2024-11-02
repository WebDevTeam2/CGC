import { GiFilmProjector } from "react-icons/gi";
import Link from "next/link";
import TvFilter from "@/app/components/Movie-components/TvFilter";
import { baseUrl, options, TVShows } from "@/app/Constants/constants";
import TVShowCards from "@/app/components/Movie-components/TVShowCards";
import MoviePages from "@/app/components/Movie-components/Pages";

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
      <div className="grid grid-cols-2 mt-4 h-full not-search shows-grid gap-2 mx-auto w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-0 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 ">
        <TVShowCards tvShowData={showData} upcoming />
      </div>
      <div>
        <MoviePages page={Number(params.page)} link={"/Movies/TVShows/Upcoming-tvshows"} />
      </div>
    </div>
  );
};

export default UpComing;
