import Image from "next/legacy/image";
import Recommendations from "@/app/components/Movie-components/Recommendations";
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

const getMovieDetails = async (id: string) => {
  const res = await fetch(`${baseUrl}${id}?${apiKey}`);
  const data = await res.json();
  return data;
};

const MovieDetails = async ({ params }: { params: MovieDetails }) => {
  const movie: MovieDetails = await getMovieDetails(params.id.toString());

  return (
    <main className="font-roboto not-search id-main">
      <h1 className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] my-10 font-medium text-4xl">
        {movie.title}
      </h1>
      <div className="main-content flex md:flex-row mb-6 lg:md:flex-row md:ml-[10rem] lg:ml-[20rem] mt-[2rem] gap-4">
        <div className="relative image-container md:w-72 md:h-96 lg:w-72 lg:h-96">
          <Image
            src={`${imageURL}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            layout="fill"
            objectFit="cover"
            priority
            className="movie-image"
          />
        </div>

        <div className="sm:ml-5 md:ml-10 lg:ml-40 flex flex-col text-[18px] gap-3">
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
          <div className="rating flex flex-row gap-2">
            <p>
              {movie.vote_average.toString().slice(0, 3)}/10 ({movie.vote_count}
              )
            </p>
            <FaStar className="mt-[2.5px]" />
          </div>
        </div>
      </div>
      <span className="add-to-watchlist text-center sm:ml-5 md:ml-[8rem] lg:ml-[18rem] lg:mt-10">
        <button className="ml-8 rounded-sm p-4 text-white bg-[#4c545b]">
          +Add to watchlist
        </button>
      </span>
      <div className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{movie.overview}</p>
      </div>
      <Recommendations movieId={params.id.toString()} />
    </main>
  );
};

export default MovieDetails;
