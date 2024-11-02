import TVShowsRecommendations from "@/app/Components/Movie-components/TVShowsRecommendations";
import { FaStar } from "react-icons/fa6";
import { baseUrl, imageURL, options, TVDetails } from "@/app/Constants/constants";
import AddToWatchlistId from "@/app/Components/Movie-components/AddToWatchlistId";


const getTVDetails = async (id: string) => {
  const res = await fetch(
    `${baseUrl}/tv/${id}?${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data;
};

const TVShowDetails = async ({ params }: { params: TVDetails }) => {
  const tvShow: TVDetails = await getTVDetails(params.id.toString());

  return (
    <main className="font-roboto not-search id-main lg:-ml-6">
      <h1 className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] my-10 font-medium text-4xl">
        {tvShow.name}
      </h1>
      <div className="main-content flex md:flex-row mb-6 lg:md:flex-row md:ml-[10rem] lg:ml-[20rem] mt-[2rem] gap-4">
      <div className="relative w-48 h-72 md:w-72 md:h-96 lg:w-72 lg:h-96">
          <img
            src={`${imageURL}${tvShow.poster_path}`}
            alt={`${tvShow.name} poster`}
            className="object-cover h-full w-full absolute"
          />
        </div>

        <div className="md:ml-10 lg:ml-40 flex flex-col text-[18px] gap-3">
          <h2 className="font-bold">Movie title: </h2>
          <p className="">{tvShow.name}</p>
          <h2 className="font-bold">Original title: </h2>
          <p className="">{tvShow.original_name}</p>
          <h2 className="font-bold">Seasons: </h2>
          <div className="">
            {tvShow.seasons.map((season) => (
              <div key={season.id} className="flex justify-center lg:justify-normal md:justify-normal flex-row gap-3 ">
                {season.season_number > 0 && season.air_date < "2024-05-19" && (
                  <div className="flex flex-row gap-3">
                    <p>Season {season.season_number}</p>
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
          <div className="rating flex flex-row gap-2">
            <p>
              {tvShow.vote_average.toString().slice(0, 3)}/10 (
              {tvShow.vote_count})
            </p>
            <FaStar className="mt-[2.5px]" />
          </div>
        </div>
      </div>
      <div className="md:ml-40 lg:ml-[20rem] lg:mt-10">
        <AddToWatchlistId movieId={Number(params.id)} />
      </div>
      <div className="md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px]">
        <h2 className="font-bold">Overview:</h2>
        <p>{tvShow.overview}</p>
      </div>
      <TVShowsRecommendations tvShowID={params.id.toString()} />
    </main>
  );
};

export default TVShowDetails;
