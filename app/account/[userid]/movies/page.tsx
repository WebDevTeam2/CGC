"use client";
import { FaStar } from "react-icons/fa";
import UserOptions from "@/app/components/Account-components/UserOptions";
import { useSession } from "next-auth/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
}

const Account = ({ params }: { params: { userid: string } }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [curr, setCurr] = useState(0);
  const { userid } = params;

  const getVotecolor = (vote: number) => {
    if (vote >= 7) return "text-green-500";
    if (vote >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const handlePrev = () => {
    setCurr((prevCurr) => {
      const newIndex = prevCurr - 4;
      return newIndex < 0 ? 0 : newIndex;
    });
  };

  const handleNext = () => {
    setCurr((prevCurr) => {
      const newIndex = prevCurr + 4;
      return newIndex >= movies.length ? prevCurr : newIndex;
    });
  };

  useEffect(() => {
    const fetchUser = async (userid: string) => {
      try {
        const response = await fetch(`/api/users/${userid}`, { method: "GET" });
        const responseData = await response.json();
        setUser(responseData.data);
        setImageUrl(responseData.data.profilePicture);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    if (userid) fetchUser(userid);
  }, [userid]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user?._id) {
        try {
          const response = await fetch(`/api/watchlist/${user._id}`, {
            method: "GET",
          });
          const data = await response.json();
          if (response.ok && data.movies) {
            setMovies(data.movies);
          }
        } catch (error) {
          console.error("Error fetching watchlist:", error);
        }
      }
    };

    fetchWatchlist();
  }, [user]);

  return (
    <div className="back-img h-screen flex text-center justify-center">
      <Link href={`/`} className="absolute pointer-events-none">
        <h2 className="ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      <div className="flex rounded-2xl items-center shadow-lg my-28 bg-slate-300">
        <UserOptions />
        <div className="flex flex-col h-full mr-20 gap-0 my-12">
          {imageUrl && (
            <>
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden group">
                <Image
                  src={imageUrl}
                  alt="User Avatar"
                  layout="fill"
                  priority={true}
                  className="object-cover"
                />
              </div>
              <span className="text-2xl">Watchlist: </span>

              {/* Carousel Component */}
              <div className="overflow-hidden relative w-full">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${curr * 25}%)` }} // Each item takes 25% width (4 items)
                >
                  {movies.map((movie) => (
                    <div className="w-1/4 h-full z-20 p-2" key={movie.id}>
                      <Link
                        href={`/Movies/${movie.id}`}
                        className="flex flex-col z-20 h-full pointer-events-auto" // Make Link fill the div
                      >
                        <div className="relative w-full h-64">
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            layout="fill"
                            objectFit="cover"
                            className="absolute w-full h-full"
                          />
                        </div>
                        <div className="bg-[#4c545b] w-full overflow-hidden p-4 text-center text-white">
                          <h2>{movie.title}</h2>
                          <div className="mt-auto justify-center flex items-center gap-2">
                            <span
                              className={`${getVotecolor(
                                movie.vote_average
                              )}`}
                            >
                              {movie.vote_average.toString().slice(0, 3)}
                            </span>
                            <FaStar color="yellow" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="absolute z-10 inset-1 flex items-center justify-between p-4">
                  <button
                    onClick={handlePrev}
                    disabled={curr === 0}
                    className="p-2 bg-gray-500 text-white rounded-full"
                  >
                    <FaChevronLeft size={40} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={curr >= movies.length - 4} // Updated to reflect movie count
                    className="p-2 bg-gray-500 text-white rounded-full"
                  >
                    <FaChevronRight size={40} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
