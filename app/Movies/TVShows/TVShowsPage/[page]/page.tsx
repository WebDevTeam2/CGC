import Image from "next/legacy/image";
import Link from "next/link";
import TvShowPages from "@/app/components/Movie-components/TvShowPages";

const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/";
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDhhZDI4OWM2MGZkMGJiM2ZjOWNjMzY2MzkzN2Q3YiIsInN1YiI6IjY1ZTAzYzE3Zjg1OTU4MDE4NjRlZDFhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K9v9OEoLELW62sfz4qnwX7lhqTrmT6AipOjL0UlI5vY",
  },
};

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
  first_air_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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

const getTVShowData = async (page: string) => {
  const res = await fetch(
    `${baseUrl}discover/tv?include_adult=false&page=${page}&${apiKey}`,
    options
  );
  const data = await res.json();
  return data;
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

const Page = async ({ params }: { params: TVShows }) => {
  const tvShowData: TVShows = await getTVShowData(`${params.page.toString()}`);
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search shows-grid">
        {/* Kanw Link oloklhrh th kartela */}
        {tvShowData.results
          .filter((item) => item.first_air_date <= currentDate)
          .map((item) => (
            <Link
              key={item.id}
              href={`/Movies/TVShows/${item.id}`}
              className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out mb-6 card-link"
            >
              <div className="flex flex-col items-center">
                {/* image dipla apo ta images me ta noumera */}
                <div className="relative w-full h-56 sm:h-56 lg:h-96">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full absolute"
                    priority
                  />
                </div>
                <div className="bg-[#4c545b] w-full h-44 gap-4 p-4">
                  <div className="flex justify-between text-white">
                    <h2>{item.name}</h2>
                    <span
                      className={`${getVotecolor(item.vote_average)} mt-auto`}
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
      <div className="">
        <TvShowPages />
      </div>
    </div>
  );
};

export default Page;
