import { ImTv } from "react-icons/im";
import Link from "next/link";
import UpComingMoviesPages from "@/app/components/Movie-components/UpcomingMoviesPages";
import Filter from "@/app/components/Movie-components/Filter";
import { baseUrl, MovieResult, options } from "@/app/constants/constants";
import Cards from "@/app/components/Movie-components/Cards";


//Kanw fetch tis upcoming tainies, to fetch ginetai apo pollaples selides an den ginei 20 tainiwn apo mia selida
//px. An to fetch ths selidas 1 logw tou filter emfanisei 10 tainies anti gia 20, tote tha kanei fetch tainies kai apo thn selida 2
const getMovieData = async (initialPage: number, moviesNeeded: number): Promise<MovieResult[]> => {
  let movies: MovieResult[] = [];
  const currentDate = new Date().toISOString().split("T")[0]; //metavlhth gia to shmerino date

  // Kanw fetch mexri 20 tainies gia to kathe page
  while (movies.length < moviesNeeded) {
    const res = await fetch(
      `${baseUrl}movie/upcoming?include_adult=false&page=${initialPage}&${process.env.MOVIE_API_KEY}`,
      options
    );
    const data = await res.json();

    //Krataw mono tis tainies pou den exoun kykloforisei akoma, ara to release_date na einai megalytero tou currentDate
    const filteredMovies = data.results.filter(
      (item: any) => item.release_date > currentDate
    );

    movies = movies.concat(filteredMovies); //Tis vazw sto array me ta movies
    initialPage++;  //Increment thn twrinh selida
    if (data.results.length === 0) break; // An den yparxoun alles tainies kanw break
  }
  return movies;
};

const UpComing = async ({ params }: { params: { page: string } }) => {
  const page = parseInt(params.page);
  const moviesPerPage = 20;
  const allMovies = await getMovieData(page, moviesPerPage * page); // Fetch enough movies to cover the current page

  const startIndex = (page - 1) * moviesPerPage;
  const movieData = allMovies.slice(startIndex, startIndex + moviesPerPage);

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="flex justify-end mr-10 mt-2">
        <Link
          href={"/Movies/TVShows/Upcoming-tvshows/1"}
          className="flex flex-row gap-2 items-center hover:opacity-85 transition duration-200 justify-end p-2 rounded mt-2 cursor-pointer text-[#d1d1d1] bg-[#4c545b] not-search"
        >
          <ImTv style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          <span>TV Shows</span>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
       <Cards movieResultData={movieData} upcoming/>
      </div>
      <div>
        <UpComingMoviesPages />
      </div>
    </div>
  );
};
export default UpComing;
