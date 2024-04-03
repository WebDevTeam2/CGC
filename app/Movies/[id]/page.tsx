import Image from "next/legacy/image";
import { FaStar } from "react-icons/fa6";

const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const imageURL = "https://image.tmdb.org/t/p/w500";

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

const getVotecolor = (vote: number) => {
  if (vote >= 8) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

const getMovieDetails = async (id: string) => {
  const res = await fetch(`${baseUrl}${id}?${apiKey}`);
  return res.json();
};

const MovieDetails = async ({ params }: { params: MovieDetails }) => {
  const movie: MovieDetails = await getMovieDetails(params.id.toString());

  return (
    <main className="font-roboto">
      <h1 className="ml-[20rem] my-10 font-medium text-4xl">{movie.title}</h1>
      <div className="flex flex-row ml-[20rem] mt-[2rem] gap-4">
        <Image
          src={`${imageURL}${movie.poster_path}`}
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
          <h2 className="font-bold">Genre: </h2>
          <p className="">
            {movie.genres.map((genre) => {
              return genre.name + ", ";
            })}
          </p>
          <h2 className="font-bold">Rating: </h2>
          <div className="flex flex-row gap-2">
            <p>{movie.vote_average.toString().slice(0, 3)}/10</p>
            <FaStar className="mt-[2.5px]" />
          </div>
        </div>
      </div>
      <div className="ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{movie.overview}</p>
      </div>
    </main>
  );
};

export default MovieDetails;
