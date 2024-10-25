import GenrePages from "@/app/components/Movie-components/GenrePages";
import Filter from "@/app/components/Movie-components/Filter";
import { options, baseUrl, Movie } from "@/app/constants/constants";
import Cards from "@/app/components/Movie-components/Cards";

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
    <div>
      <Filter />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search">
        {/* Kanw Link oloklhrh th kartela */}
        <Cards movieData={movieData} />
      </div>
      <div className="">
        <GenrePages />
      </div>
    </div>
  );
};

export default FilteredByGenre;
