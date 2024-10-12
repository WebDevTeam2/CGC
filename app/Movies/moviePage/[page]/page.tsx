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
    `${baseUrl}discover/movie?include_adult=false&page=${page}&${process.env.API_KEY}`,
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
              className="flex flex-col h-55 items-center hover:scale-110 hover:border hover:shadow-2xl hover:shadow-gray-600 lg:w-full md:w-full transition duration-700 ease-in-out mb-6 card-link"
            >
              {/* Image container */}
              <Link
                href={`/Movies/${item.id}`}
                className="relative w-full h-56 sm:h-56 lg:h-96"
              >
                <Image
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute w-full h-full"
                  priority
                />
              </Link>

              {/* Text container */}
              <div className="bg-[#4c545b] w-full lg:h-48 md:h-[55%] h-full gap-4 p-4 flex flex-col card-text-container">
                <Link
                  href={`/Movies/${item.id}`}
                  className="flex justify-between items-start text-white"
                >
                  <h2>{item.title}</h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${getVotecolor(item.vote_average)} mt-auto`}
                    >
                      {item.vote_average.toString().slice(0, 3)}
                    </span>
                    <FaStar color="yellow" />
                  </div>
                </Link>
                {/* Add to watchlist button */}
                <div className="flex justify-center mt-4 ml-[-2rem]">
                  <AddToWatchlist movieId={item.id} />
                </div>
                <span className="text-white justify-center text-center">
                  Review
                </span>
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
