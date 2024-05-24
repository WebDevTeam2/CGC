import Image from "next/image";
import "../style.css";
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
  description: string;
}

const getGame = async (name: string) => {
  const res = await fetch(basePosterUrl + name + apiPosterKey);
  // https://api.rawg.io/api/games/grand-theft-auto-v?key=f0e283f3b0da46e394e48ae406935d25
  const data = await res.json();
  // console.log(data);
  return data;
};

//this function uses regex to replace html tags inside the description
const stripHtmlTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi;
  return html.replace(regex, "");
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
      <div className="flex items-center md:items-stretch flex-col md:flex-row pt-[10vh] h-[88vh] justify-evenly">
        <div className="flex md:w-[38vw] w-[85vw] flex-col relative pt-0">
          <div className="relative md:h-[45vh] h-[35vh] w-full">
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
                <span className="flex gap-1 text-white">
                  {convertToStars(game.rating)}
                </span>
              </div>
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">
                  Release date:{" "}
                </span>
                <span>{game.released}</span>
              </div>
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">Genres:</span>
                <span className="text-balance">
                  {game.genres &&
                    game.genres.length > 0 &&
                    game.genres.map(
                      (genre: { name: string }, index: number) => (
                        <span key={index}>
                          {index > 0 && ","}{" "}
                          {/* Add slash if not the first platform */}
                          {genre.name}
                        </span>
                      )
                    )}
                </span>
              </div>
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">Tags:</span>
                <span className="text-balance">
                  {game.tags &&
                    game.tags.length > 0 &&
                    game.tags.map((tag: { name: string }, index: number) => (
                      <span key={index}>
                        {index > 0 && ","}{" "}
                        {/* Add slash if not the first platform */}
                        {tag.name}
                      </span>
                    ))}
                </span>
              </div>
              <div className="flex md:flex-row md:items-stretch items-center flex-col md:justify-between justify-normal">
                <span className="lg:text-lg text-2xl font-bold">
                  Platforms:
                </span>
                <span className="md:text-end ">
                  {game.platforms &&
                    game.platforms.length > 0 &&
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
                    )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <span className="font-inter leading-8 border shadow-xl shadow-gray-600 relative md:w-1/2 w-4/5 md:h-[78vh] h-auto bg-stone-900/60 p-6 rounded-2xl md:text-balance text-center text-white text-xl transition-[width] md:overflow-hidden md:overflow-y-visible overflow-visible ease-in-out duration-300">
          {game.description && stripHtmlTags(game.description)}
        </span>
      </div>
      {/* <Loader /> */}
      <Screenshots params={params} />
      {/* button functionality here */}
    </div>
  );
}
