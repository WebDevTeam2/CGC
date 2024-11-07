import { getGameDets } from "@/app/Game Collection/functions";
import WriteReview from "@/app/Components/Game-components/WriteReview";

export default async function Games({ params }: { params: any }) {
  const games = await getGameDets(params.name);
  return <WriteReview userId={params.userid} game={games} />;
}
