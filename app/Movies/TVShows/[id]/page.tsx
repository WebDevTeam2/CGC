import Image from "next/legacy/image";
import TVShowsRecommendations from "@/app/components/Movie-components/TVShowsRecommendations";
import { FaStar } from "react-icons/fa6";

const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/tv/";
const imageURL = "https://image.tmdb.org/t/p/w500";

interface TVShows {
  page: number;
  results: TVResult[];
}

interface TVResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  air_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface TVDetails {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  air_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  seasons: Seasons[];
}

interface Genre {
  id: number;
  name: string;
}

interface Seasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

const getTVDetails = async (id: string) => {
  const res = await fetch(`${baseUrl}${id}?${apiKey}`);
  const data = await res.json();
  return data;
};

const TVShowDetails = async ({ params }: { params: TVDetails }) => {
  const tvShow: TVDetails = await getTVDetails(params.id.toString());

  return (
    <main className="font-roboto not-search">
      <h1 className="ml-[20rem] my-10 font-medium text-4xl">{tvShow.name}</h1>
      <div className="flex flex-row ml-[20rem] mt-[2rem] gap-4">
        <Image
          src={`${imageURL}${tvShow.poster_path}`}
          alt={`${tvShow.name} poster`}
          width={300}
          height={450}
          priority
        />

        <div className="ml-40 flex flex-col text-[18px] gap-3">
          <h2 className="font-bold">Movie title: </h2>
          <p className="">{tvShow.name}</p>
          <h2 className="font-bold">Original title: </h2>
          <p className="">{tvShow.original_name}</p>
          <h2 className="font-bold">Seasons: </h2>
          <div className="">
            {tvShow.seasons.map((season) => (
              <div className="flex flex-row gap-3">
                {season.season_number > 0 && season.air_date < "2024-05-19" && (
                  <div className="flex flex-row gap-3">
                    <p key={season.id}>Season {season.season_number}</p>
                    <p>Episodes: </p>
                    <p>{season.episode_count}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {tvShow.genres && tvShow.genres.length > 0 && (
            <div>
              <h2 className="font-bold">Genre: </h2>
              <p className="">
                {tvShow.genres.map((genre) => {
                  return genre.name + ", ";
                })}
              </p>
            </div>
          )}
          <h2 className="font-bold">Rating: </h2>
          <div className="flex flex-row gap-2">
            <p>
              {tvShow.vote_average.toString().slice(0, 3)}/10 (
              {tvShow.vote_count})
            </p>
            <FaStar className="mt-[2.5px]" />
          </div>
        </div>
      </div>
      <div className="ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{tvShow.overview}</p>
      </div>
      <TVShowsRecommendations tvShowID={params.id.toString()} />
    </main>
  );
};

export default TVShowDetails;
