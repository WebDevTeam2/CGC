import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";
import Screenshots from "@/app/components/Game-components/Screenshots";

const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = "?key=f0e283f3b0da46e394e48ae406935d25";

interface Post {
  page: number;
  results: PostPage[];
}
interface PostPage {
  id: number;
  slug: string;
  name: string;
  next: string;
  previous: string;
  count: number;
  playtime: number;
  reddit_logo: string;
  ratings_count: number;
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
  tags: [
    {
      id: number;
      name: string;
      slug: string;
      language: string;
      games_count: number;
      image_background: string;
    }
  ];
  released: string;
  tba: boolean;
  background_image: string;
  background_image_additional: string;
  rating: number;
  rating_top: number;
  description_raw: string;
}

const getGame = async (name: string) => {
  const res = await fetch(basePosterUrl + name + apiPosterKey);
  // https://api.rawg.io/api/games/grand-theft-auto-v?key=f0e283f3b0da46e394e48ae406935d25
  const data = await res.json();
  return data;
};

//this function uses regex to replace html tags inside the description
const stripHtmlTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi;
  const stripped = html.replace(regex, "");
  return stripped;
};

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
  const rest = 1 - remainder;
  let percentage_r = remainder * 100 + "%";
  // let rest_r = rest * 100 + "%";

  for (let i = 0; i < whole; i++) {
    newR.push(
      <IoStarSharp
        key={i}
        style={{
          background: "darkgreen",
          fontSize: "26px",
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
          fontSize: "26px",
          padding: "2px",
        }}
      />
    );
  }

  return newR;
};

export default async function Games({ params }: { params: PostPage }) {
  const game = await getGame(params.name);

  return (
    <div>
      <div className="bg-black fixed h-screen w-screen"></div>
      <h1 className="text-white font-inter text-4xl pt-16 pb-20 relative h-12 flex items-center justify-center">
        {game.name}
      </h1>
      <div className="flex items-center md:items-stretch flex-col md:flex-row h-[88vh] justify-evenly gap-20 pl-0">
        <div className="flex md:w-[50vw] h-[75vh] w-[85vw] flex-col relative pl-10">
          <div className="relative h-[35vh] w-full">
            <Image
              src={game.background_image}
              alt={game.name}
              fill={true}
              objectFit="cover"
            />
          </div>
          <div className="relative flex flex-col -top-10">
            <div className="fade-bottom"></div>
            <div className="flex md:flex-col flex-row md:gap-2 gap-8 text-lg md:px-4 px-0 py-6 text-center font-inter text-white bg-black rounded-b-xl h-full">
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">Rating:</span>
                {game.rating > 0 ? (
                  <span className="flex gap-1 text-white">
                    {convertToStars(game.rating)}({roundNum(game.ratings_count)}
                    )
                  </span>
                ) : (
                  <span>---</span>
                )}
              </div>
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">
                  Release date:{" "}
                </span>
                {game.released ? (
                  <span className="flex gap-1 text-white">{game.released}</span>
                ) : (
                  <span>TBA</span>
                )}
              </div>
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">Genres:</span>
                <span className="text-balance">
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
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">
                  Platforms:
                </span>
                <span className="md:text-end ">
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
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">Playtime:</span>
                {game.playtime > 0 ? (
                  <span>about {game.playtime}h</span>
                ) : (
                  <span>---</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {game.description_raw ? (
          <span className="font-inter leading-8 border shadow-xl shadow-gray-600 relative md:w-1/2 w-4/5 md:h-[78vh] h-auto bg-stone-900/60 p-6 rounded-2xl md:text-balance text-center text-white text-xl transition-[width] md:overflow-hidden md:overflow-y-visible overflow-visible ease-in-out duration-300">
            {game.description_raw}
          </span>
        ) : (
          <span>---</span>
        )}
        <Screenshots params={params} />
      </div>
      {/* button functionality here */}
    </div>
  );
}
