import Image from "next/legacy/image";
import { GiFilmProjector } from "react-icons/gi";
import Link from "next/link";
import UpComingTvShowsPages from "@/app/components/Movie-components/UpcomingTvShowsPages";
import TvFilter from "@/app/components/Movie-components/TvFilter";
import { baseUrl, imageURL, options, TVShows } from "@/app/constants/constants";
import TVShowCards from "@/app/components/Movie-components/TVShowCards";

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
        <TVShowCards tvShowData={showData} upcoming />
      </div>
      <div>
        <UpComingTvShowsPages />
      </div>
    </div>
  );
};

export default UpComing;
