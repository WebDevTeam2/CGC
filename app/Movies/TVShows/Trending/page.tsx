import Link from "next/link";
import Image from "next/legacy/image";
import { ImTv } from "react-icons/im";

const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/";
const ApiURL = baseUrl + "trending/tv/day?page=1&language=en-US&" + apiKey;
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDhhZDI4OWM2MGZkMGJiM2ZjOWNjMzY2MzkzN2Q3YiIsInN1YiI6IjY1ZTAzYzE3Zjg1OTU4MDE4NjRlZDFhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K9v9OEoLELW62sfz4qnwX7lhqTrmT6AipOjL0UlI5vY'
  }
};

interface TVShow {
  page: number;
  results: TVShowResult[];
}

interface TVShowResult {
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

const getTVShowData = async (url: string) => {
  const res = await fetch(url, options);
  const data = await res.json();
  return data;
};

const getVotecolor = (vote: number) => {
  if (vote >= 8) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

const Trending = async () => {
  const tvShowData: TVShow = await getTVShowData(ApiURL);
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="overflow-hidden">
      <div className="flex justify-end mr-10 mt-2">
        <Link
          href={"/Movies/Movies-trending"}
          className="flex flex-row gap-2 items-center hover:opacity-85 transition duration-200 justify-end p-2 rounded mt-2 cursor-pointer text-[#d1d1d1] bg-[#4c545b] not-search"
        >
          <ImTv style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          <span>TV Shows</span>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 h-full mt-4 not-search">
        {tvShowData.results.filter(item => item.first_air_date  <= currentDate).map(
          (item) =>
            item.overview && (
              <Link
                key={item.id}
                href={`/Movies/TVShows/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:hover:scale-110 w-full transition duration-700 ease-in-out mb-6 "
              >
                <div className="sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full absolute"
                    priority
                  />
                </div>
                <div className="bg-[#4c545b] h-44 gap-4 cards">
                  <div className="flex ml-4 text-white">
                    <h2 className="">{item.name}</h2>
                    <span
                      className={`${getVotecolor(
                        item.vote_average
                      )} ml-auto mr-5 mt-11`}
                    >
                      {item.vote_average.toString().slice(0, 3)}
                    </span>
                  </div>
                  <p className="mt-4 ml-4 text-white">
                    {item.overview.slice(0, 40)}...
                  </p>
                </div>
              </Link>
            )
        )}
      </div>
    </div>
  );
};

export default Trending;
