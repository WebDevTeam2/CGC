// Import necessary dependencies
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Sort from "./Sort";

interface Post {
  page: number;
  results: PostResult[];
}
interface PostResult {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  description: string;
}
// https://api.rawg.io/api/games?key=f0e283f3b0da46e394e48ae406935d25
const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=f0e283f3b0da46e394e48ae406935d25";
const apiPosterUrl =
  basePosterUrl + "?" + apiPosterKey + "&dates=2023-01-01,2024-05-13";

// const singlePosterUrl = `https://api.rawg.io/api/games`;
// const apiPosterKey = "key=f0e283f3b0da46e394e48ae406935d25";
// const apiPosterUrl = basePosterUrl + "?" + apiPosterKey;

//this function uses regex to replace html tags inside the description
const stripHtmlTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi;
  return html.replace(regex, "");
};

const getGameData = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  //this command iterates over the array of game results fetched from url
  //for each game it creates a promise that fetched additional data about each game like its description
  const gameDetailsPromises = data.results.map(async (game: PostResult) => {
    const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
    const gameData = await gameRes.json();
    const strippedDescription = stripHtmlTags(gameData.description);
    //this return command is used to get the original game details plus its description
    return { ...game, description: strippedDescription };
  });
  // This ensures that all game details are fetched before proceeding.
  const gameDetails = await Promise.all(gameDetailsPromises);
  // this line returns an object with the original data fetched from (data) with the updated results property, where each game now includes an description.
  return { ...data, results: gameDetails };
};

const getSingleGameData = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const Posts = async () => {
  try {
    const gameData: Post = await getGameData(apiPosterUrl);
    const singleGameData: Post = await getSingleGameData(apiPosterUrl);
    // Render the component
    return (
      <div>
        <Sort />
        <ul className="relative flex mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
          {gameData.results.map((item) => (
            <li
              key={item.id}
              className="text-slate-200 text-balance text-xl hover:scale-110 xl:w-3/5 w-4/5  transition-all duration-500 ease-in-out"
            >
              <Link
                href={`/Games/${item.name
                  .toLowerCase()
                  .replace(/ /g, "-")
                  .replace(/:/g, "")
                  .replace(/\([^)]*\)/g, "")
                  .replace(/-+$/g, "")}`}
                className="relative flex group border-2 md:h-60 h-[33rem] border-white rounded-lg transition-all duration-300"
              >
                <div className="bg-black rounded-lg bg-opacity-[.7] relative flex flex-col md:flex-row md:gap-0 gap-2 transition-all duration-400">
                  <div className="relative overflow-hidden md:pb-56 pb-72 md:pr-96">
                    <Image
                      src={item.background_image}
                      alt={item.name}
                      priority={true}
                      fill={true}
                      style={{ objectFit: "cover" }}
                      className="border-r-4 rounded-l-lg border-white transition duration-500 ease-in-out"
                    />
                  </div>
                  <div
                    className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 items-center justify-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                    style={{
                      transition:
                        "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                    }}
                  >
                    <span className="text-white">{item.name}</span>
                  </div>
                  <div className="overflow-hidden pl-4 leading-9 ">
                    <span>{item.description}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.log("Error fetching game data:", error);
    return <div>Error fetching game data</div>;
  }
};
// Export the Posts component
export default Posts;
