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
import { Navigation } from "swiper/modules";
import { getVotecolor, User } from "@/app/Constants/constants";
import Footer from "@/app/Components/Footer";

interface WatchlistItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  vote_average: number;
  poster_path: string | null;
}

const ViewWatchlist = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        try {
          const userResponse = await fetch(
            `/api/getUserDetails/${session.user.email}`
          );
          const userData = await userResponse.json();

          if (!userResponse.ok || !userData?._id) {
            console.error(
              "Error fetching user details:",
              userResponse.statusText
            );
            return;
          }
          setUser(userData);

          //fetch user watchlist
          const watchlistResponse = await fetch(
            `/api/watchlist/${userData._id}`,
            {
              method: "GET",
            }
          );
          const watchlistData = await watchlistResponse.json();
          if (watchlistResponse.ok) {
            setWatchlist(watchlistData.watchlist || []); // Assuming `watchlist` is an array
          } else {
            console.error(
              "Error fetching watchlist:",
              watchlistResponse.statusText
            );
          }
          console.log(watchlistData);
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        }
      }
    };

    fetchData();
  }, [session?.user?.email]); // Only re-run this effect if the session changes\

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
          {user?.profilePicture && (
            <>
              <div className="relative min-[912px]:w-20 min-[912px]:h-20 w-16 h-16 rounded-full overflow-hidden group">
                <img
                  src={user.profilePicture}
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
                    640: {
                      slidesPerView: 2, // 2 slides on small devices
                    },
                    1024: {
                      slidesPerView: 4, // Larger screens adapt to watchlist length
                    },
                  }}
                  modules={[Navigation]}
                  className="w-full h-full"
                >
                  {watchlist.map((item: any) => (
                    <SwiperSlide key={item.id} className="">
                      <Link
                        href={
                          item.media_type === "movie"
                            ? `/Movies/${item.id}`
                            : `/Movies/TVShows/${item.id}`
                        }
                        className="w-96 h-full"
                      >
                        <div className="relative w-full h-64">
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title || item.name}
                            layout="fill"
                            objectFit="cover"
                            className="absolute w-full h-full"
                          />
                        </div>
                        <div className="bg-[#4c545b] w-full overflow-hidden p-4 text-center text-white">
                          <h2>{item.title || item.name}</h2>
                          <div className="mt-auto justify-center flex items-center gap-2">
                            <span
                              className={`${getVotecolor(item.vote_average)}`}
                            >
                              {item.vote_average.toString().slice(0, 3)}
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

export default ViewWatchlist;
