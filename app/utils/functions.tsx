import { Collection, Db, MongoClient, Document, ObjectId } from "mongodb";
import clientPromise from "../../lib/mongo/page";

let client: MongoClient | undefined;
let db: Db | undefined;
let games: Collection<Document> | undefined;

const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=076eda7a1c0e441eac147a3b0fe9b586";
const apiPosterUrl = `${basePosterUrl}?${apiPosterKey}`;

async function init(): Promise<void> {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    games = await db.collection("games");
    await games.createIndex({ id: 1 }, { unique: true });
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

interface PostResult {
  _id: string;
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  description: string;
  description_raw: string;
  parent_platforms: Platform[];
}

const getGameData = async (url: string, page: number) => {
  try {
    const res = await fetch(`${url}&page=${page}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data.results) {
      throw new Error("Invalid data structure");
    }
    return data.results as PostResult[];
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

export const fetchAndCombineDataSimple = async () => {
  try {
    if (!games) await init();
    if (!games) throw new Error("Games collection is not initialized");

    const currentYear: number = new Date().getFullYear();
    const startYear: number = 2005;
    const dateRanges: string[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      dateRanges.push(`${year}-01-01,${year}-12-31`);
    }

    // Fetch all ranges in parallel
    const allGames = await Promise.all(
      dateRanges.map(async (dateRange) => {
        try {
          // Query MongoDB to check if games for this date range exist
          const gamesInRange = (await games
            ?.find<PostResult>({
              released: {
                $gte: `${dateRange.split(",")[0]}`,
                $lte: `${dateRange.split(",")[1]}`,
              },
            })
            .project({
              id: 1,
              released: 1,
              description_raw: 1,
              background_image: 1,
              name: 1,
              slug: 1,
              parent_platforms: 1,
              rating: 1,
            })
            .toArray()) as PostResult[];

          // If no games are found, fetch from the API
          if (!gamesInRange || !gamesInRange.length) {
            console.log(
              `No games found for date range: ${dateRange}, fetching from RAWG API...`
            );

            const dateRangeUrl = `${apiPosterUrl}&dates=${dateRange}`;
            const gameResults = await getGameData(dateRangeUrl, 1);
            const slicedResults = gameResults.slice(0, 10);

            // Insert the fetched games into the database in bulk
            await games?.insertMany(
              slicedResults.map((game) => ({
                ...game,
                _id: new ObjectId(), // Generate a new ObjectId
              })),
              { ordered: false } // Allows continuing even if some documents already exist
            );

            return slicedResults; // Return the newly fetched data
          } else {
            console.log("fetching from database");
            return gamesInRange; // Return the data from the database
          }
        } catch (error) {
          console.error(`Error processing date range ${dateRange}:`, error);
          return [];
        }
      })
    );

    // Flatten the array of arrays into a single array
    const flattenedGames = allGames.flat();

    // Convert _id to string (if not I get an error)
    const plainGames = flattenedGames.map((game) => ({
      ...game,
      _id: game._id.toString(), // Convert ObjectId to string
    }));
    // Shuffle the combined array of games (if needed)
    shuffleArray(plainGames);

    return plainGames;
  } catch (error) {
    console.error("Error in fetchAndCombineDataSimple:", error);
    return [];
  }
};

const shuffleArray = <T,>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const platformIds: { [key: string]: number } = {
  pc: 1,
  playstation: 2,
  xbox: 3,
  nintendo: 7,
};

//this works for the company page games
export const fetchAndCombineData = async (name: string) => {
  const platformId = platformIds[name.toLowerCase()];
  if (!platformId) {
    throw new Error(`Invalid platform name: ${name}`);
  }
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineDataSimple();

  // Filter games based on the platform ID
  const filteredGames = allGames.filter((game) =>
    game.parent_platforms?.some(
      (platform) => platform.platform.id === platformId
    )
  );

  return filteredGames;
};

//this function is for the newely released games
export const fetchByRelease = async () => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineDataSimple();

  // Filter games to return newest first
  const filteredGames = allGames.sort((a, b) => {
    const dateA = new Date(a.released);
    const dateB = new Date(b.released);
    // console.log(dateA);
    // console.log(dateB.getTime() - dateA.getTime());
    return dateB.getTime() - dateA.getTime();
  });

  // console.log(filteredGames);
  return filteredGames;
};

//this function sorts the greatest games first
export const fetchByRating = async () => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineDataSimple();

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => b.rating - a.rating);

  // Return the sorted games
  return sortedGames;
};

//this function is for the newely released games
export const fetchByReleaseConsole = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineData(name);

  // Filter games to return newest first
  const filteredGames = allGames.sort((a, b) => {
    const dateA = new Date(a.released);
    const dateB = new Date(b.released);
    // console.log(dateA);
    // console.log(dateB.getTime() - dateA.getTime());
    return dateB.getTime() - dateA.getTime();
  });

  // console.log(filteredGames);
  return filteredGames;
};

//this function sorts the greatest games first
export const fetchByRatingConsole = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineData(name);

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => b.rating - a.rating);

  // Return the sorted games
  return sortedGames;
};

export const paginateGames = (
  games: PostResult[],
  page: number,
  pageSize: number
) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return games.slice(start, end);
};

export const fetchGameDetails = async (game: PostResult) => {
  try {
    const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
    if (!gameRes.ok) {
      throw new Error(`HTTP error! status: ${gameRes.status}`);
    }
    const gameData = await gameRes.json();
    return { ...game, description_raw: gameData.description_raw };
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};
