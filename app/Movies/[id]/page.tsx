import Recommendations from "@/app/Components/Movie-components/Recommendations";
import { FaStar } from "react-icons/fa6";
import AddToWatchlistId from "@/app/Components/Movie-components/AddToWatchlistId";
import {
  options,
  baseUrl,
  imageURL,
  MovieDetails,
} from "@/app/Constants/constants";
import Link from "next/link";
import UserMovieReviews from "@/app/Components/Movie-components/UserMovieReviews";

const getMovieDetails = async (id: string) => {
  const res = await fetch(
    `${baseUrl}/movie/${id}?${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  const movieWithMediaType = {
    ...data,
    media_type: "movie",
  }; 

  return movieWithMediaType;
};

const MovieDetailsData = async ({ params }: { params: MovieDetails }) => {
  const movie: MovieDetails = await getMovieDetails(params.id.toString());
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <main className="font-roboto not-search id-main lg:-ml-6">
      <h1 className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] my-10 font-medium text-4xl">
        {movie.title}
      </h1>
      <div className="main-content flex md:flex-row mb-6 lg:md:flex-row md:ml-[10rem] lg:ml-[20rem] mt-[2rem] gap-4">
        <div className="relative w-48 h-72 md:w-72 md:h-96 lg:w-72 lg:h-96">
          <img
            src={`${imageURL}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            className="object-cover absolute w-full h-full"
          />
        </div>

        <div className="md:ml-10 lg:ml-40 flex flex-col text-[18px] gap-3">
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
        <div className="lg:mx-auto flex flex-col gap-2">
          <h2 className="font-bold">User Reviews: </h2>
          <UserMovieReviews movieId={Number(params.id)} />
        </div>
      </div>
      {movie.release_date < currentDate ? (
        <div className="md:ml-40 lg:ml-[20rem] lg:mt-10 flex gap-2">
          <AddToWatchlistId id={Number(params.id)} media_type="movie" />
          <Link
            href={`/Movies/${params.id}/reviews`}
            className="bg-[#6a7f97] text-center p-2 transition duration-200 hover:opacity-75 text-white rounded-sm"
          >
            Write a review
          </Link>
        </div>
      ) : (
        <span className="font-semibold rounded-sm py-2 px-6 watchlist-button bg-[#5d676f] text-white text-lg md:ml-40 lg:ml-[20rem] lg:mt-10">This movie has not been released yet.</span>
      )}
      <div className="md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{movie.overview}</p>
      </div>
      <Recommendations movieId={params.id.toString()} />
    </main>
  );
};

export default MovieDetailsData;
