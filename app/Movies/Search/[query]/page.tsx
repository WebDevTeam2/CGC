import AddToWatchlist from "@/app/components/Movie-components/AddToWatchlist";
import Filter from "@/app/components/Movie-components/Filter";
import Pages from "@/app/components/Movie-components/Pages";
import Image from "next/legacy/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const baseMovieUrl = "https://api.themoviedb.org/3/search/movie";
const baseTVUrl = "https://api.themoviedb.org/3/search/tv";
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 43200 },
};
interface Result {
  id: number;
  title?: string; // Movies have 'title'
  name?: string; // TV shows have 'name'
  vote_average: number;
  media_type: "movie" | "tv";
  overview: string;
  poster_path?: string;
  popularity: number;
}

const getMovieData = async (query: string): Promise<Result[]> => {
  const res = await fetch(
    `${baseMovieUrl}?query=${query}&include_adult=false&language=en-US&page=1&${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data.results.map((result: any) => ({
    ...result,
    media_type: "movie",
  }));
};

const getTVShowData = async (query: string): Promise<Result[]> => {
  const res = await fetch(
    `${baseTVUrl}?query=${query}&include_adult=false&language=en-US&page=1&${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data.results.map((result: any) => ({ ...result, media_type: "tv" }));
};

const getVotecolor = (vote: number) => {
  if (vote >= 7) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

const searchPage = async ({ params }: any) => {
  const movieResults = await getMovieData(`${params.query}`);
  const tvResults = await getTVShowData(`${params.query}`);
  const allResults = [...movieResults, ...tvResults]; //Array me ta apotelesmata kai twn tainiwn kai twn seirwn

  //Kanw sort ta apotelesmata gia na emfanizontai prwta ayta pou exoun ypsili dhmotikotita kai meso oro megalytero tou 0
  allResults.sort((a, b) => {
    if (b.vote_average === a.vote_average) return b.popularity - a.popularity;
    else if (b.vote_average !== a.vote_average)
      return b.vote_average - a.vote_average;
    else return 0;
  });

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 w-3/4 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
        {allResults.map((item) => (
          <div
            key={item.id}
            className="lg:hover:scale-110 md:hover:scale-110 md:hover:border md:hover:shadow-2xl md:hover:shadow-gray-600 lg:hover:border lg:hover:shadow-2xl lg:hover:shadow-gray-600 w-full transition card-link duration-500 ease-in-out mb-6"
          >
            {/* Image container */}
            <Link
              href={`/${
                item.media_type === "tv" ? "Movies/TVShows" : "Movies"
              }/${item.id}`}
            >
              <div className="card-image-container sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
                <Image
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.media_type === "tv" ? item.name : item.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full absolute"
                  priority
                />
              </div>
            </Link>

            {/* Text container */}
            <div className="bg-[#4c545b] flex flex-col h-44 cards card-text-container">
              <Link
                href={`/${
                  item.media_type === "tv" ? "Movies/TVShows" : "Movies"
                }/${item.id}`}
                className="flex lg:ml-4 h-10 text-white justify-between"
              >
                <div className="card-title-container">
                  <h2>{item.media_type === "tv" ? item.name : item.title}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`${getVotecolor(item.vote_average)}`}>
                    {item.vote_average.toString().slice(0, 3)}
                  </span>
                  <FaStar color="yellow" />
                </div>
              </Link>
              <div className="movies-buttons-container md:mt-6 flex flex-col justify-center gap-4">
                <div className="flex justify-center mt-4 ml-[-2rem]">
                  <AddToWatchlist movieId={item.id} />
                </div>
                <span className="text-white justify-center text-center">
                  Review
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default searchPage;
