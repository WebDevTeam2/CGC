import Image from "next/legacy/image";
import Link from "next/link";
import Pages from "@/app/components/Movie-components/Pages";
import { FaStar } from "react-icons/fa";
import Filter from "@/app/components/Movie-components/Filter";
import AddToWatchlist from "@/app/components/Movie-components/AddToWatchlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { findUserByEmail } from "@/app/collection/connection";

const baseUrl = "https://api.themoviedb.org/3/";
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 43200 },
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
    `${baseUrl}discover/movie?include_adult=false&page=${page}&${process.env.MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data;
};

const getVotecolor = (vote: number) => {
  if (vote >= 7) return "text-green-500";
  if (vote >= 6) return "text-yellow-500";
  return "text-red-500";
};

const Page = async ({ params }: { params: Movie }) => {
  const movieData: Movie = await getMovieData(`${params.page.toString()}`);
  const currentDate = new Date().toISOString().split("T")[0];
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  let user;
  if (userEmail) user = await findUserByEmail(userEmail);

  return (
    <div className="overflow-hidden">
      <Filter />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 md:gap-8 lg:gap-8 w-3/4 md:ml-32 lg:ml-64 mt-4 h-full not-search movies-grid">
        {movieData.results
          .filter((item) => item.release_date <= currentDate)
          .map((item) => (
            <div
              key={item.id}
              className="lg:hover:scale-110 md:hover:border md:hover:shadow-2xl md:hover:shadow-gray-600 lg:hover:border lg:hover:shadow-2xl lg:hover:shadow-gray-600 w-full transition card-link duration-500 ease-in-out mb-6"
            >
              {/* Image container */}
              <Link href={`/Movies/${item.id}`}>
                <div className="card-image-container sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
                  <Image
                    src={`${imageURL}${item.poster_path}`}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute w-full h-full"
                    priority
                  />
                </div>
              </Link>

              {/* Text container */}
              <div className="bg-[#4c545b] flex flex-col h-44 cards card-text-container">
                <Link
                  href={`/Movies/${item.id}`}
                  className="flex lg:ml-4 h-10 text-white justify-between"
                >
                  <div className="card-title-container">
                    <h2>{item.title}</h2>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${getVotecolor(item.vote_average)}`}>
                      {item.vote_average.toString().slice(0, 3)}
                    </span>
                    <FaStar color="yellow" />
                  </div>
                </Link>
                {/* watchlist and review container */}
                <div className="movies-buttons-container md:mt-6 flex flex-col justify-center gap-4">
                  <div className="flex justify-center mt-4 ml-[-2rem]">
                    <AddToWatchlist movieId={item.id} />
                  </div>
                  <span className="text-white justify-center text-center">
                    Review
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <Pages />
      </div>
    </div>
  );
};
export default Page;
