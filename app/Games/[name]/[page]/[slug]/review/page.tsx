import Link from "next/link";
import { IoReturnUpBack } from "react-icons/io5";

const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = `key=076eda7a1c0e441eac147a3b0fe9b586`;

interface PostPage {
  id: number;
  slug: string;
  name: string;
  next: string;
  previous: string;
  ratings_count: number;
  ratings: [
    {
      id: number;
      title: string; //this is the one I want
      count: number;
    }
  ];
  background_image: string;
}

interface Post {
  page: number;
}

interface Rating {
  id: number;
  title: string;
  count: number;
}
interface CombinedParams extends PostPage, Post {}

const getGame = async (name: string) => {
  const res = await fetch(basePosterUrl + name + "?" + apiPosterKey);
  // https://api.rawg.io/api/games/grand-theft-auto-v?key=f0e283f3b0da46e394e48ae406935d25
  const data = await res.json();
  return data;
};

const reactions = [
  { id: 5, reaction: "😃" },
  { id: 4, reaction: "🙂" },
  { id: 3, reaction: "🤔" },
  { id: 1, reaction: "😔" },
];

const getReaction = (id: number) => {
  const reaction = reactions.find((reaction) => reaction.id === id);
  return reaction ? reaction.reaction : "❓";
};

export default async function Games({ params }: { params: CombinedParams }) {
  const game = await getGame(params.name);
  const sortedRatings = game.ratings.sort(
    (a: Rating, b: Rating) => b.id - a.id
  );

  return (
    <div className="bg-black flex flex-col relative items-center bg-cover h-screen w-full">
      <Link
        href={`/Games/${game.slug}/${params.page}/${params.slug}`}
        className="w-full pointer-events-none"
      >
        <button className="bg-stone-300 ml-4 mt-4 pointer-events-auto left-0 text-4xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-110">
          <IoReturnUpBack />
        </button>
      </Link>
      <form className="flex mt-10 flex-col relative bg-neutral-200 rounded-2xl">
        {/* header of review */}
        <div className="p-8 flex flex-col gap-3 font-sans border-2 rounded-t-2xl bg-black w-full">
          <span className="text-orange-400 font-extrabold text-xl">
            Write a review
          </span>
          <span className="text-white text-4xl">{game.name}</span>
        </div>
        {/* start of reactions */}
        <div className="p-5 flex flex-wrap flex-row gap-3 font-serif border rounded-b-xl bg-black w-full">
          {sortedRatings.map(
            (rating: { id: number; title: string }, index: number) => (
              <div
                role="button"
                key={index}
                className="flex transition-all duration-200 hover:bg-neutral-600 bg-black  active:bg-neutral-600 items-center gap-2 border rounded-full pr-6 p-2"
              >
                <span className="text-3xl">{getReaction(rating.id)}</span>
                <span className="text-white text-xl">{rating.title}</span>
              </div>
            )
          )}
        </div>
        {/* start of textarea */}
        <textarea
          className="text-xl h-96 p-8 rounded-t-2xl outline-none bg-neutral-200"
          placeholder="Type Here..."
        ></textarea>
        <input
          role="button"
          className="text-xl transition-all rounded-b-2xl duration-200 bg-neutral-400 hover:bg-neutral-500 p-3"
          type="submit"
        ></input>
      </form>
    </div>
  );
}
