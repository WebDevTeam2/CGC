import Image from "next/image";
const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = "?key=f0e283f3b0da46e394e48ae406935d25";

type PostPage = {
  id: number;
  slug: string;
  name: string;
  // released: string;
  // tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  description: string;
};

const getGame = async (name: string) => {
  const res = await fetch(basePosterUrl + name + apiPosterKey);
  const data = await res.json();
  return data;
  //this command iterates over the array of game results fetched from url
  //for each game it creates a promise that fetched additional data about each game like its description
  //   const gameDetailsPromises = data.results.map(async (game: PostResult) => {
  //     const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
  //     const gameData = await gameRes.json();
  //     const strippedDescription = stripHtmlTags(gameData.description);
  //     //this return command is used to get the original game details plus its description
  //     return { ...game, description: strippedDescription };
  //   });
  //   // This ensures that all game details are fetched before proceeding.
  //   const gameDetails = await Promise.all(gameDetailsPromises);
  //   // this line returns an object with the original data fetched from (data) with the updated results property, where each game now includes an description.
  //   return { ...data, results: gameDetails };
};

export default async function Games({ params }: { params: PostPage }) {
  const game = await getGame(params.name);

  return (
    <div>
      <h2>Game Details</h2>
      <h3>{game.name}</h3>
      <Image
        src={game.background_image}
        alt={game.name + " Background Image"}
        layout="fill"
        objectFit="cover"
      ></Image>
    </div>
  );
}
