import Filter from "@/app/Components/Movie-components/Filter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authDbConnection/authOptions";
import { findUserByEmail } from "@/app/User Collection/connection";
import { baseUrl, Movie, MovieResult, options } from "@/app/Constants/constants";
import Cards from "@/app/Components/Movie-components/Cards";
import MoviePages from "@/app/Components/Movie-components/Pages";

const getMovieData = async (page: string): Promise<Movie> => {
  try {
    const res = await fetch(
      `${baseUrl}discover/movie?include_adult=false&page=${page}&${process.env.MOVIE_API_KEY}`,
      options
    );

    if (!res.ok) {
      console.error(`Failed to fetch movies: ${res.statusText}`);
      return { page: 0, results: [] }; // Return an empty Movie object
    }

    const data = await res.json();

    // Add media_type to each movie
    const resultsWithMedia = data.results.map((movie: MovieResult) => ({
      ...movie,
      media_type: "movie",
    }));

    // Return the modified data
    return {
      page: data.page,
      results: resultsWithMedia,
    };
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return { page: 0, results: [] }; // Return an empty Movie object on error
  }
};

const Page = async ({ params }: { params: Movie }) => {
  const movieData: Movie = await getMovieData(`${params.page.toString()}`);
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  let user;
  if (userEmail) user = await findUserByEmail(userEmail);

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="grid grid-cols-2 mt-4 h-full not-search movies-grid gap-y-2 mx-auto w-[92%] md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 lg:w-3/4 md:w-[80%] md:ml-32 lg:ml-64 ">
        {/* We display the results based on their release year */}
        <Cards movieData={movieData} />
      </div>
      <div>
        <MoviePages page={Number(params.page)} link={`/Movies/moviePage`} />
      </div>
    </div>
  );
};
export default Page;
