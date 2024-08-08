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
    <main className="font-roboto not-search">
      <h1 className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] my-10 font-medium text-4xl">{movie.title}</h1>
      <div className="flex flex-row sm:ml-5 md:ml-[10rem] lg:ml-[20rem] mt-[2rem] gap-4">
        <Image
          src={`${imageURL}${movie.poster_path}`}
          alt={`${movie.title} poster`}
          width={300}
          height={450}
          objectFit="cover"
          priority
        />

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
          <div className="flex flex-row gap-2">
            <p>
              {movie.vote_average.toString().slice(0, 3)}/10 ({movie.vote_count})
            </p>
            <FaStar className="mt-[2.5px]" />
          </div>
        </div>
      </div>
      <div className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{movie.overview}</p>
      </div>
      <Recommendations movieId={params.id.toString()} />
    </main>
  );
};

export default MovieDetails;
