import Filter from "@/app/components/Movie-components/Filter";
import Pages from "@/app/components/Movie-components/Pages";
import Image from "next/legacy/image";
import Link from "next/link";
// import Pages from "@/app/components/Movie-components/Pages";
const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseMovieUrl = "https://api.themoviedb.org/3/search/movie";
const baseTVUrl = "https://api.themoviedb.org/3/search/tv";
const imageURL = "https://image.tmdb.org/t/p/w500";

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
    `${baseMovieUrl}?query=${query}&include_adult=false&language=en-US&page=1&${apiKey}`
  );
  const data = await res.json();
  return data.results.map((result: any) => ({
    ...result,
    media_type: "movie",
  }));
};

const getTVShowData = async (query: string): Promise<Result[]> => {
  const res = await fetch(
    `${baseTVUrl}?query=${query}&include_adult=false&language=en-US&page=1&${apiKey}`
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
        {/* Kanw Link oloklhrh th kartela */}
        {allResults.map((item) => (
          <Link
            key={item.id}
            href={`/${item.media_type === "tv" ? "Movies/TVShows" : "Movies"}/${
              item.id
            }`}
            className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out mb-6 card-link"
          >
            {/* Container for the image and content */}
            <div className="flex flex-col items-center">
              {/* Image container */}
              <div className="relative w-full h-56 sm:h-56 lg:h-96">
                <Image
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.media_type === "tv" ? item.name : item.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full absolute"
                  priority
                />
              </div>
              {/* Text container */}
              <div className="bg-[#4c545b] w-full h-44 gap-4 p-4">
              <div className="flex justify-between text-white">
                  <h2 className="">
                    {item.media_type === "tv" ? item.name : item.title}
                  </h2>
                  <span
                    className={`${getVotecolor(
                      item.vote_average
                    )} mt-auto`}
                  >
                    {item.vote_average.toString().slice(0, 3)}
                  </span>
                </div>
                <p className="mt-4 text-white">
                  {item.overview.slice(0, 40)}...
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default searchPage;
