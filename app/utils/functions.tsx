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
    await games.createIndex({ released: 1 });
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

interface Genre {
  id: number;
  name: string;
  slug: string;
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
  genres: Genre[];
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

let cachedGames: PostResult[] | null = null;

export const fetchAndCombineDataSimple = async (): Promise<PostResult[]> => {
  // Return cached games if already fetched
  if (cachedGames) {
    console.log("Returning cached games");
    return cachedGames;
  }

  try {
    if (!games) await init(); // Initialize games collection if not done yet
    if (!games) throw new Error("Games collection is not initialized");

    const currentYear: number = new Date().getFullYear();
    const startYear: number = 2005;
    const dateRanges: string[] = [];

    // Create date ranges for each year
    for (let year = startYear; year <= currentYear; year++) {
      dateRanges.push(`${year}-01-01,${year}-12-31`);
    }

    // Fetch all ranges in parallel
    const allGames = await Promise.all(
      dateRanges.map(async (dateRange) => {
        try {
          // Query MongoDB for games in this date range
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
              rating: 1,
              parent_platforms: 1,
              genres: 1,
              slug: 1,
              name: 1,
              background_image: 1,
            })
            .toArray()) as PostResult[];

          // Convert ObjectId to string if MongoDB returns games
          const processedGames = gamesInRange.map((game) => ({
            ...game,
            _id: game._id.toString(), // Convert ObjectId to string
          }));

          // Fallback to RAWG API if no games found in the database
          if (!processedGames.length) {
            console.log(
              `No games found for date range: ${dateRange}, fetching from RAWG API...`
            );

            const dateRangeUrl = `${apiPosterUrl}&dates=${dateRange}`;
            const gameResults = await getGameData(dateRangeUrl, 1);
            const slicedResults = gameResults.slice(0, 15);

            // Upsert games fetched from RAWG API into MongoDB
            await games?.bulkWrite(
              slicedResults.map((game) => ({
                updateOne: {
                  filter: { id: game.id }, // Use 'id' as unique key
                  update: { $set: { ...game, _id: new ObjectId() } },
                  upsert: true, // Insert if doesn't exist
                },
              })),
              { ordered: false }
            );

            // Return the newly fetched results
            return slicedResults;
          } else {
            return processedGames;
          }
        } catch (error) {
          console.error(`Error processing date range ${dateRange}:`, error);
          return [];
        }
      })
    );

    // Flatten the array of arrays
    cachedGames = allGames.flat();
    return cachedGames;
  } catch (error) {
    console.error("Error fetching and combining data:", error);
    throw error;
  }
};

export const extractGenres = async () => {
  try {
    const games = await fetchAndCombineDataSimple();
    const genresSet = new Set<Genre>();

    games.forEach((game) => {
      if (game.genres && Array.isArray(game.genres)) {
        game.genres.forEach((genre) => {
          // Only add the genre if there isn't already one in the set with the same ID
          const existingGenre = Array.from(genresSet).find(
            (g) => g.id === genre.id
          );
          if (!existingGenre) {
            genresSet.add(genre);
          }
        });
      }
    });

    // Convert the Set back to an array
    const genresArray = Array.from(genresSet);

    return genresArray;
  } catch (error) {
    console.error("Error in extractGenres:", error);
    return [];
  }
};

export const shuffleArray = <T,>(array: T[]): void => {
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
      (platform: Platform) => platform.platform.id === platformId
    )
  );

  return filteredGames;
};

//this works for the company page games
export const fetchByGenre = async (slug: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineDataSimple();

  // Filter games based on the genre name
  const filteredGames = allGames.filter((game) =>
    game.genres?.some((genre) => genre.slug === slug)
  );

  return filteredGames;
};

export const fetchByGenreName = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchByGenre(name);

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => a.name.localeCompare(b.name));

  // Return the sorted games
  return sortedGames;
};

export const fetchByGenreRating = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchByGenre(name);

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => b.rating - a.rating);

  // Return the sorted games
  return sortedGames;
};

export const fetchByGenreRelease = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchByGenre(name);

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

export const fetchByGenreConsole = async (name: string, slug: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineData(name);

  // Filter games based on the genre name
  const filteredGames = allGames.filter((game) =>
    game.genres?.some((genre) => genre.slug === slug)
  );

  return filteredGames;
};

export const fetchByGenreConsoleName = async (name: string, slug: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchByGenreConsole(name, slug);

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => a.name.localeCompare(b.name));

  // Return the sorted games
  return sortedGames;
};

export const fetchByGenreConsoleRating = async (name: string, slug: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchByGenreConsole(name, slug);

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => b.rating - a.rating);

  // Return the sorted games
  return sortedGames;
};

export const fetchByGenreConsoleRelease = async (
  name: string,
  slug: string
) => {
  // Get all games fetched by the first function
  const allGames = await fetchByGenreConsole(name, slug);

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

//this function is for the newely released games
export const fetchByRelease = async () => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineDataSimple();

  // Filter games to return newest first
  const filteredGames = allGames.sort((a, b) => {
    const dateA = new Date(b.released);
    const dateB = new Date(a.released);
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

//this function sorts the greatest games first
export const fetchByName = async () => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineDataSimple();

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => a.name.localeCompare(b.name));

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

//this function sorts the greatest games first
export const fetchByNameConsole = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineData(name);

  // Sort the games by rating in descending order
  const sortedGames = allGames.sort((a, b) => a.name.localeCompare(b.name));

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
  console.log(
    `Page: ${page}, Start: ${start}, End: ${end}, Total Games: ${games.length}`
  );
  return games.slice(start, end);
};

export const fetchGameDetails = async (game: PostResult) => {
  try {
    const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
    if (!gameRes.ok) {
      throw new Error(`HTTP error! status: ${gameRes.status}`);
    }
    const gameData = await gameRes.json();
    return {
      ...game,
      parent_platforms: gameData.parent_platforms,
      genres: gameData.genres,
      slug: gameData.slug,
      name: gameData.name,
      background_image: gameData.background_image,
      description_raw: gameData.description_raw,
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};
