"use client";
import UserOptions from "@/app/components/Account-components/UserOptions";
import { useSession } from "next-auth/react";
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
  const [currentIndex, setCurrentIndex] = useState(0); // Track the start of the displayed movies
  const { userid } = params;

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

  const handleNext = () => {
    if (currentIndex < movies.length - 4) setCurrentIndex(currentIndex + 4);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 4);
  };

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

              {/* Carousel container */}
              <div className="relative w-full flex items-center justify-center">
                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 p-2 bg-gray-500 text-white rounded-full z-10"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                  disabled={currentIndex === 0}
                >
                  &#8249;
                </button>

                {/* Movie Cards */}
                <div className="overflow-hidden w-full">
                  <div className="flex transition-transform gap-2 duration-500">
                    {movies
                      .slice(currentIndex, currentIndex + 4)
                      .map((movie) => (
                        <Link
                          href={`/Movies/${movie.id}`}
                          key={movie.id}
                          className="lg:hover:scale-110 lg:w-full md:w-[90%] transition duration-700 ease-in-out card-link"
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
                            <p>{movie.vote_average}</p>
                          </div>
                        </Link>
                      ))}

                    {/* Empty Cards to Maintain Layout */}
                    {movies.length - currentIndex < 4 &&
                      Array.from(Array(4 - (movies.length - currentIndex))).map(
                        (_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="w-48 mx-2 flex-shrink-0"
                          ></div>
                        )
                      )}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 p-2 bg-gray-500 text-white rounded-full z-10"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                  disabled={currentIndex >= movies.length - 4}
                >
                  &#8250;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
