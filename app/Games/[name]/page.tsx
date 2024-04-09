import Image from "next/image";
import "../style.css";
import { IoStarSharp } from "react-icons/io5";
import { stringify } from "querystring";
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
  count: number;
  next: null;
  previous: null;
  results: [
    {
      id: number;
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
  return data;
};

//this function uses regex to replace html tags inside the description
const stripHtmlTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi;
  return html.replace(regex, "");
};

const convertToStars = (rating: number) => {
  const newR: JSX.Element[] = [];
  // const whole = Math.floor(rating);
  // const remainder = rating - whole;

  for (let i = 0; i < rating; i++) {
    newR.push(<IoStarSharp key={i} />);
  }

  return newR;
};
{
  /* <IoStarSharp /> */
}

export default async function Games({ params }: { params: PostPage }) {
  const game = await getGame(params.name);

  return (
    <div>
      <div className="bg-slate-700 fixed h-screen w-screen"></div>
      <div className="flex flex-row pt-20 justify-evenly">
        <div className="flex w-[37rem] flex-col relative pt-0">
          <Image
            src={game.background_image}
            alt={game.name}
            width={600}
            height={600}
          />
          <div className="relative flex flex-col -top-10">
            <div className="fade-bottom"></div>
            <div className="flex flex-col gap-2 text-lg px-24 py-10 border-0 text-center font-inter text-white bg-black rounded-b-xl h-[22rem]">
              <div className="flex flex-row justify-between">
                <span className="font-bold">Rating:</span>
                <span className="flex text-green-700">
                  {/* {game.rating} / {game.rating_top} */}
                  {convertToStars(game.rating)} {game.rating}
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="font-bold">Release date: </span>
                <span>{game.released}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="font-bold">Genres:</span>
                <span className="text-balance">
                  {game.genres.map((genre: { name: string }, index: number) => (
                    <span key={index}>
                      {index > 0 && ","}{" "}
                      {/* Add slash if not the first platform */}
                      {genre.name}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex flex-row justify-between gap-16">
                <span className="font-bold">Platforms: </span>
                <span className="text-end">
                  {game.platforms.map(
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
        <span className="font-inter leading-8 border relative w-1/2 h-full bg-stone-900/60 p-6 rounded-2xl text-balance text-white text-xl transition-[width] ease-in-out duration-300">
          {stripHtmlTags(game.description)}
        </span>
      </div>
    </div>
  );
}
