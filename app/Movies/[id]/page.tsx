import Image from "next/legacy/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const imageURL = "https://image.tmdb.org/t/p/w500";

interface Movies {
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

interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
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

interface Genre {
  id: number;
  name: string;
}

const getVotecolor = (vote:number) => {
  if (vote >= 8) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
}

const getMovieDetails = async (id: string) => {
  const res = await fetch(`${baseUrl}${id}?&${apiKey}`);
  const data = await res.json();
  return data;
};

const getRecommendations = async (id: String) => {
  const res = await fetch(
    `${baseUrl}${id}/recommendations?adult=false&language=en-US&page=1?&${apiKey}`
  );
  const data = await res.json();
  return data;
};

const MovieDetails = async ({ params }: { params: MovieDetails }) => {
  const movie: MovieDetails = await getMovieDetails(params.id.toString());
  const recommendedMovieData: Movies = await getRecommendations(
    params.id.toString()
  );

  return (
    <main className="font-roboto ">
      <h1 className="ml-[20rem] my-10 font-medium text-4xl">{movie.title}</h1>
      <div className="flex flex-row ml-[20rem] mt-[2rem] gap-4">
        <Image
          src={`${imageURL}${movie.poster_path}`}
          alt={`${movie.title} poster`}
          width={300}
          height={450}
          objectFit="cover"
          priority
        />

        <div className="ml-40 flex flex-col text-[18px] gap-3">
          <h2 className="font-bold">Movie title: </h2>
          <p className="">{movie.title}</p>
          <h2 className="font-bold">Original title: </h2>
          <p className="">{movie.original_title}</p>
          <h2 className="font-bold">Release Date: </h2>
          <p className="">{movie.release_date}</p>
          {movie.genres && movie.genres.length > 0 && (
            <div>
              <h2 className="font-bold">Genre: </h2>
              <p className="">
                {movie.genres.map((genre) => {
                  return genre.name + ", ";
                })}
              </p>
            </div>
          )}
          <h2 className="font-bold">Rating: </h2>
          <div className="flex flex-row gap-2">
            <p>
              {movie.vote_average.toString().slice(0, 3)}/10 ({movie.vote_count}
              )
            </p>
            <FaStar className="mt-[2.5px]" />
          </div>
        </div>
      </div>
      <div className="ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{movie.overview}</p>
      </div>

        <h2 className="ml-[20rem] mt-10 text-[18px] font-bold">Recommended Movies: </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-[20rem] h-full not-search">
        {recommendedMovieData.results.map((item) => (
          <Link
          key={item.id}
          href={`/Movies/${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="lg:hover:scale-110 w-full transition duration-700 ease-in-out mb-6"
        >
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
    </main>
  );
};

export default MovieDetails;
