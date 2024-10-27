import GenrePages from "@/app/components/Movie-components/GenrePages";
import Filter from "@/app/components/Movie-components/Filter";
import { options, baseUrl, Movie } from "@/app/constants/constants";
import Cards from "@/app/components/Movie-components/Cards";
import MoviePages from "@/app/components/Movie-components/[page]/Pages";

const getMovieData = async (page: string, genre: string) => {
  const res = await fetch(
    `${baseUrl}discover/movie?include_adult=false&page=${page}&with_genres=${genre}&sort_by=primary_release_date.desc&vote_count.gte=10&with_original_language=en&${process.env.MOVIE_API_KEY}`,
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
  const movieData: Movie = await getMovieData(`${params.page}`, params.genre);

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="grid grid-cols-2 mt-4 h-full not-search movies-grid gap-y-2 mx-auto w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 ">
        {/* Kanw Link oloklhrh th kartela */}
        <Cards movieData={movieData} />
      </div>
      <div className="">
        <MoviePages page={Number(params.page)} link={`/Movies/Genres/${params.genre}`} />
      </div>
    </div>
  );
};

export default FilteredByGenre;
