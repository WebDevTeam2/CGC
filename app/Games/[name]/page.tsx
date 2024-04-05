import Image from "next/image";
import "../style.css";
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

export default async function Games({ params }: { params: PostPage }) {
  const game = await getGame(params.name);

  return (
    <div>
      <div className="bg-slate-700 fixed h-screen w-full"></div>
      <div className="flex pt-10 flex-col items-center justify-center">
        <span className="font-inter leading-8 border relative 2xl:w-1/2 xl:w-4/6 w-5/6 bg-stone-900/60 p-6 rounded-2xl text-balance text-white text-xl transition-[width] ease-in-out duration-300">
          {stripHtmlTags(game.description)}
        </span>
      </div>
    </div>
  );
}
