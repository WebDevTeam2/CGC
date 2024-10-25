import Image from "next/legacy/image";
import Link from "next/link";
import TvShowPages from "@/app/components/Movie-components/TvShowPages";
import TvFilter from "@/app/components/Movie-components/TvFilter";
import { FaStar } from "react-icons/fa";
import AddToWatchlist from "@/app/components/Movie-components/AddToWatchlist";
import { getVotecolor, options, TVShows } from "@/app/constants/constants";
import TVShowCards from "@/app/components/Movie-components/TVShowCards";

const baseUrl = "https://api.themoviedb.org/3/";
const imageURL = "https://image.tmdb.org/t/p/w500";


const getTVShowData = async (page: string) => {
  const res = await fetch(
    `${baseUrl}discover/tv?include_adult=false&page=${page}&${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data;
};

const Page = async ({ params }: { params: TVShows }) => {
  const tvShowData: TVShows = await getTVShowData(`${params.page.toString()}`);
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden">
      <TvFilter />
      <div className="grid msm:grid-cols-2 msm:gap-y-2 msm:mx-auto msm:w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 mt-4 h-full not-search shows-grid">
        <TVShowCards tvShowData={tvShowData} />
      </div>
      <div className="">
        <TvShowPages />
      </div>
    </div>
  );
};

export default Page;
