import ChangeTab from "./ChangeTab";
import Link from "next/link";
import Image from "next/legacy/image";

const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/";
const ApiURL = baseUrl + "trending/movie/day?page=1&language=en-US&" + apiKey;
const imageURL = "https://image.tmdb.org/t/p/w500";


interface Movie {
  page: number;
  results: MovieResult[];
}

interface MovieResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const getMovieData = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const getVotecolor = (vote:number) => {
  if (vote >= 8) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
}

const Trending = async () => {
  const movieData: Movie = await getMovieData(ApiURL);

    return (
      <div>
        <ChangeTab />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 h-full not-search">
          {/* Kanw Link oloklhrh th kartela */}
          {movieData.results.map((item) => (
            <Link
              key={item.id}
              href={`/Movies/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hover:scale-110 w-full transition duration-700 ease-in-out mb-6 "
            >
              {/* image dipla apo ta images me ta noumera */}
              <div className="sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
                <Image
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full absolute"
                  priority
                />
              </div>
              <div className="bg-[#4c545b] h-44 gap-4 cards">
                <div className="flex ml-4 text-white">
                  <h2 className="">{item.title}</h2>
                  <span className={`${getVotecolor(item.vote_average)} ml-auto mr-5 mt-11`}>{item.vote_average.toString().slice(0,3)}</span>  
                </div>
                <p className = "mt-4 ml-4 text-white">{item.overview.slice(0, 40)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  export default Trending;
