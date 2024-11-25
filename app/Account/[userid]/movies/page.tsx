"use client";
import { FaStar } from "react-icons/fa";
import UserOptions from "@/app/Components/Account-components/UserOptions";
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { getVotecolor } from "@/app/Constants/constants";
import Footer from "@/app/Components/Footer";

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

  return (
    <div className="back-img overflow-auto relative w-full h-full flex flex-col text-center items-center">
      <Link href={`/`} className="w-full pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      <div className="flex sm:flex-row flex-col rounded-2xl shadow-lg mt-12 mb-[5.1rem] sm:mx-6 mx-4 bg-slate-300">
        <UserOptions />
        <div className="flex flex-col items-center min-[912px]:mx-12 mx-0 gap-0 mt-8 mb-10">
          {imageUrl && (
            <>
              <div className="relative min-[912px]:w-20 min-[912px]:h-20 w-16 h-16 rounded-full overflow-hidden group">
                <img
                  src={imageUrl}
                  alt="User Avatar"
                  className="object-cover w-full h-full absolute"
                />
              </div>
              <div className="w-full max-w-xs md:max-w-md lg:max-w-4xl mx-auto">
                <span className="text-2xl">Watchlist: </span>
                {/* Carousel Component */}
                <Swiper
                  slidesPerView={2}
                  spaceBetween={10}
                  navigation={true}
                  breakpoints={{
                    1024: { slidesPerView: 4 }, // For larger screens
                  }}
                  modules={[Navigation]}
                  className="w-full"
                >
                  {movies.map((movie) => (
                    <SwiperSlide key={movie.id} className="">
                      <Link
                        href={`/Movies/${movie.id}`}
                        className="w-full h-full"
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
                              className={`${getVotecolor(movie.vote_average)}`}
                            >
                              {movie.vote_average.toString().slice(0, 3)}
                            </span>
                            <FaStar color="gold" />
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
