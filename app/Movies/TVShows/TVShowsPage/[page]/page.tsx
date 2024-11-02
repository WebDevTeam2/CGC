import TvFilter from "@/app/Components/Movie-components/TvFilter";
import { baseUrl, options, TVShows } from "@/app/Constants/constants";
import TVShowCards from "@/app/Components/Movie-components/TVShowCards";
import MoviePages from "@/app/Components/Movie-components/Pages";

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
      <div className="grid grid-cols-2 mt-4 h-full not-search movies-grid gap-y-2 mx-auto w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 ">
        <TVShowCards tvShowData={tvShowData} />
      </div>
      <div className="">
        <MoviePages page={Number(params.page)} link={"/Movies/TVShows/TVShowsPage"} />
      </div>
    </div>
  );
};

export default Page;
