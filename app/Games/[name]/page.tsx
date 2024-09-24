import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";
import Screenshots from "@/app/components/Game-components/Screenshots";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { findUserByEmail } from "@/app/collection/connection";

const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = `key=076eda7a1c0e441eac147a3b0fe9b586`;

interface PostPage {
  id: number; //use
  slug: string; //use
  name: string; //use
  playtime: number;
  ratings_count: number;
  next: string;
  previous: string;
  count: number;
  results: [
    {
      id: number;
      image: string;
      width: number;
      height: number;
      is_deleted: boolean;
      name: string;
      preview: string;
      data: {
        480: string;
        max: string;
      };
    }
  ];
  platforms: [
    {
      platform: {
        name: string;
        slug: string;
      };
    }
  ];
  genres: [
    {
      id: number;
      name: string;
      slug: string;
    }
  ];
  released: string;
  background_image: string;
  rating: number;
  rating_top: number;
  description_raw: string;
}
interface Post {
  page: number;
}
interface CombinedParams extends PostPage, Post {}

const roundNum = (rating_count: number) => {
  let newNum;
  if (rating_count >= 1000) newNum = (rating_count / 1000).toFixed(1) + "K";
  else return rating_count;
  return newNum;
};

const convertToStars = (rating: number) => {
  const newR: JSX.Element[] = [];
  const whole = Math.floor(rating);
  const remainder = rating - whole;
  let percentage_r = remainder * 100 + "%";

  for (let i = 0; i < whole; i++) {
    newR.push(
      <IoStarSharp
        key={i}
        style={{
          background: "darkgreen",
          fontSize: "24px",
          padding: "2px",
        }}
      />
    );
  }

  if (remainder > 0) {
    newR.push(
      <IoStarSharp
        key="rest"
        style={{
          background: `linear-gradient(to right, darkgreen ${percentage_r}, grey 15%)`,
          fontSize: "24px",
          padding: "2px",
        }}
      />
    );
  }

  return newR;
};

let cachedGames: { [key: string]: any } = {};

const getGameDets = async (name: string) => {
  const res = await fetch(basePosterUrl + "/" + name + "?" + apiPosterKey);
  // https://api.rawg.io/api/games/grand-theft-auto-v?key=f0e283f3b0da46e394e48ae406935d25
  const data = await res.json();
  return data;
};

export default async function Games({ params }: { params: CombinedParams }) {
  const game = await getGameDets(params.name);
  const session = await getServerSession(authOptions);
  const imageSizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";
  const userEmail = session?.user?.email; // You get this from session

  let dbUser;
  if (userEmail) {
    // Fetch the full user details from MongoDB
    dbUser = await findUserByEmail(userEmail);
  }

  return (
    <div>
      <div className="bg-black z-0 bg-cover fixed h-screen w-screen"></div>
      <Link href={`/Games/page/1`} className="absolute pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      <div className="flex pt-20 items-center lg:items-stretch flex-col lg:flex-row h-full justify-evenly xl:gap-20 gap-10 pl-0">
        <div className="flex lg:w-[50vw] h-full w-[85vw] flex-col relative lg:pl-10 pl-0">
          <div className="relative xl:h-[35vh] lg:h-[25vh] h-auto lg:p-0 min-[780px]:p-60 min-[580px]:p-44 min-[420px]:p-32 p-24 w-full">
            <Image
              src={game.background_image}
              alt={game.name}
              fill={true}
              sizes={imageSizes}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="relative flex flex-col -top-10">
            <div className="fade-bottom"></div>
            <div className="flex flex-col gap-2 text-lg px-4 py-6 text-center font-inter text-white bg-black rounded-b-xl h-full">
              <div className="flex flex-row gap-4 items-stretch justify-between">
                <span className="lg:text-lg min-[450px]:text-2xl text-xl font-bold">
                  Name:
                </span>
                <span className="flex gap-1 text-end text-white lg:text-lg min-[450px]:text-xl text-lg">
                  {game.name}
                </span>
              </div>
              <div className="flex flex-row gap-4 items-stretch justify-between">
                <span className="lg:text-lg min-[450px]:text-2xl text-xl font-bold">
                  Rating:
                </span>
                {game.rating > 0 ? (
                  <span className="flex gap-1 text-white lg:text-lg min-[450px]:text-xl text-md">
                    {convertToStars(game.rating)}({roundNum(game.ratings_count)}
                    )
                  </span>
                ) : (
                  <span>---</span>
                )}
              </div>
              <div className="flex flex-row gap-4 items-stretch justify-between">
                <span className="lg:text-lg min-[450px]:text-2xl text-xl font-bold">
                  Release date:{" "}
                </span>
                {game.released ? (
                  <span className="flex gap-1 text-end text-white lg:text-lg min-[450px]:text-xl text-lg">
                    {game.released}
                  </span>
                ) : (
                  <span>TBA</span>
                )}
              </div>
              <div className="flex flex-row gap-4 items-stretch justify-between">
                <span className="lg:text-lg min-[450px]:text-2xl text-xl font-bold">
                  Genres:
                </span>
                <span className="text-end lg:text-lg min-[450px]:text-xl text-lg">
                  {game.genres && game.genres.length > 0 ? (
                    game.genres.map(
                      (genre: { name: string }, index: number) => (
                        <span key={index}>
                          {index > 0 && ","}{" "}
                          {/* Add slash if not the first platform */}
                          {genre.name}
                        </span>
                      )
                    )
                  ) : (
                    <span>---</span>
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-4 items-stretch justify-between">
                <span className="lg:text-lg min-[450px]:text-2xl text-xl font-bold">
                  Platforms:
                </span>
                <span className="text-end lg:text-lg min-[450px]:text-xl text-lg">
                  {game.platforms && game.platforms.length > 0 ? (
                    game.platforms.map(
                      (
                        platform: { platform: { name: string } },
                        index: number
                      ) => (
                        <span key={index}>
                          {index > 0 && ","}{" "}
                          {/* Add slash if not the first platform */}
                          {platform.platform.name}
                        </span>
                      )
                    )
                  ) : (
                    <span>---</span>
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-4 items-stretch justify-between">
                <span className="lg:text-lg min-[450px]:text-2xl text-xl font-bold">
                  Playtime:
                </span>
                {game.playtime > 0 ? (
                  <span className="lg:text-lg min-[450px]:text-xl text-lg">
                    about {game.playtime}h
                  </span>
                ) : (
                  <span>---</span>
                )}
              </div>
              {dbUser ? (
                <div className="mt-4 flex w-full justify-center items-center">
                  <Link
                    href={`/Games/${game.slug}/review/${dbUser._id}`}
                    className="bg-neutral-600 hover:bg-neutral-800 text-lg py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    Write a review
                  </Link>
                </div>
              ) : (
                <div className="mt-4 flex w-full justify-center items-center">
                  <span className="bg-neutral-600 text-lg py-2 px-6 rounded-xl">
                    You have to be signed in to be able to write a review
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {game.description_raw ? (
          <span className="font-inter mb-20 leading-8 border shadow-xl shadow-gray-600 relative lg:w-1/2 w-4/5 lg:h-[78vh] h-96 overflow-y-auto lg:overflow-y-visible bg-stone-900/60 p-6 rounded-2xl md:text-balance xl:text-center text-white text-xl transition-[width] lg:overflow-hidden ease-in-out duration-300">
            {game.description_raw}
          </span>
        ) : (
          <span>No Description Yet For This Game</span>
        )}

        <Screenshots params={params} />
      </div>
    </div>
  );
}
