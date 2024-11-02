import TvFilter from "@/app/Components/Movie-components/TvFilter";
import { baseUrl, options, TVShows } from "@/app/Constants/constants";
import TVShowCards from "@/app/Components/Movie-components/TVShowCards";
import MoviePages from "@/app/Components/Movie-components/Pages";

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
  const tvShowData: TVShows= await getTVShowData(`${params.page}`, params.genre);

  return (
    <div className="overflow-hidden">
      <TvFilter />
      <div className="grid grid-cols-2 mt-4 h-full not-search movies-grid gap-y-2 mx-auto w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 ">
        {/* Kanw Link oloklhrh th kartela */}
        <TVShowCards tvShowData={tvShowData} />
      </div>
      <div className="">
        <MoviePages page={Number(params.page)} link={`/Movies/TVShows/Genres/${params.genre}`} />
      </div>
    </div>
  );
};

export default FilteredByGenre;
