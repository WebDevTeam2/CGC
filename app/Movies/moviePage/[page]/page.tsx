import Image from "next/legacy/image";
import Link from "next/link";
import Pages from "@/app/components/Movie-components/Pages";
import Filter from "@/app/components/Movie-components/Filter";
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

const getMovieData = async (page: string) => {
  const res = await fetch(
    `${baseUrl}discover/movie?include_adult=false&page=${page}&${apiKey}`,
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

const Page = async ({ params }: { params: Movie }) => {
  const movieData: Movie = await getMovieData(`${params.page.toString()}`);
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-20 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
        {/* Kanw Link oloklhrh th kartela */}
        {movieData.results
          .filter((item) => item.release_date <= currentDate)
          .map((item) => (
            <Link
              key={item.id}
              href={`/Movies/${item.id}`}
              className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out mb-6 card-link"
            >
              {/* Container for the image and content */}
              <div className="flex flex-col items-center">
                {/* Image container */}
                <div className="relative w-full h-56 sm:h-56 lg:h-96">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute w-full h-full"
                    priority
                  />
                </div>

                {/* Text container */}
                <div className="bg-[#4c545b] w-full h-44 gap-4 p-4">
                  <div className="flex justify-between text-white">
                    <h2>{item.title}</h2>
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
        <Pages />
      </div>
    </div>
  );
};

export default Page;
