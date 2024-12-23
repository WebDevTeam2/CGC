import { Collection, Db, MongoClient, Document, ObjectId } from "mongodb";
import clientPromise from "../../authDbConnection/mongo/page";
import { IoStarSharp } from "react-icons/io5";
import { User } from "../Constants/constants";
import { PostResult, Genre, Platform } from "../Constants/constants";

let client: MongoClient | undefined;
let db: Db | undefined;
let games: Collection<Document> | undefined;

const basePosterUrl = process.env.NEXT_PUBLIC_BASE_POSTER_URL;
const apiPosterKey = process.env.NEXT_PUBLIC_API_KEY;
const apiPosterUrl = `${basePosterUrl}?${apiPosterKey}`;

async function init(): Promise<void> {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    games = await db.collection("games");
    await games.createIndex({ released: 1 });
  } catch (error) {
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

//THIS FUNCTION RETURNS THE GAME DATA PER PAGE (STARTING FROM PAGE 1)
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

//MAIN FUNCTION RETURNING GAMES BASED ON YEAR
export const fetchAndCombineDataSimple = async (): Promise<PostResult[]> => {
  const currentTime = new Date();

  //LOGIC TO RETURN NEW UPDATED CONTENT IF A MONTH HAS PASSED
  if (cachedG && lastUpdated) {
    const timeDifference = currentTime.getTime() - lastUpdated.getTime();
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // Approximate one month in milliseconds

    if (timeDifference < oneMonthInMs) {
      console.log("Returning cached games");
      return cachedG;
    }
  }

  try {
    if (!games) await init(); // Initialize games collection if not done yet
    if (!games) throw new Error("Games collection is not initialized");

    const currentYear: number = new Date().getFullYear();
    const startYear: number = currentYear - 15;
    const dateRanges: string[] = [];

    for (let year = startYear; year <= currentYear; year += 5) {
      const endYear = Math.min(year + 4, currentYear);
      dateRanges.push(`${year}-01-01,${endYear}-12-31`);
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

            const dateRangeUrl = `${apiPosterUrl}&dates=${dateRange}&page_size=40`;
            const gameResults = await getGameData(dateRangeUrl, 1);
            const slicedResults = gameResults.slice(0, 40);

            // Upsert games fetched from RAWG API into MongoDB
            if (slicedResults.length) {
              const bulkOperations = slicedResults.map((game) => ({
                updateOne: {
                  filter: { id: game.id }, // Use 'id' as unique key
                  update: { $set: { ...game } },
                  upsert: true,
                },
              }));
              await games?.bulkWrite(bulkOperations, { ordered: false });
            }

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
    lastUpdated = new Date(); // Update the last updated time
    return cachedGames;
  } catch (error) {
    console.error("Error fetching and combining data:", error);
    throw error;
  }
};
//function to sort the games based on their release
export const sortGamesByRelease = (games: PostResult[]) => {
  return games.sort((a, b) => {
    const dateA = new Date(a.released);
    const dateB = new Date(b.released);
    return dateB.getTime() - dateA.getTime();
  });
};

let cachedG: PostResult[] | null = null;
let lastUpdated: Date | null = null;

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

// export const shuffleArray = <T,>(array: T[]): void => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// };

const platformIds: { [key: string]: number } = {
  pc: 1,
  playstation: 2,
  xbox: 3,
  nintendo: 7,
};

//this works for the company logo games
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
    return dateB.getTime() - dateA.getTime();
  });
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

//this function sorts by name alphabetically
export const fetchByNameConsole = async (name: string) => {
  // Get all games fetched by the first function
  const allGames = await fetchAndCombineData(name);

  // Sort the games by name in descending order
  const sortedGames = allGames.sort((a, b) => a.name.localeCompare(b.name));

  // Return the sorted games
  return sortedGames;
};

//FUNCTION THAT RETURNS 15 GAMES PER PAGE
export const paginateGames = (
  games: PostResult[],
  page: number,
  pageSize: number
) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return games.slice(start, end);
};

//FUNCTION TO GET GAME DETAILS
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

//FUNCTION THAT ROUNDS NUMBER OF RATING (USED ON GAME DETAILS)
export const roundNum = (rating_count: number) => {
  let newNum;
  if (rating_count >= 1000) newNum = (rating_count / 1000).toFixed(1) + "K";
  else return rating_count;
  return newNum;
};

//FUNCTION THAT CONVERTS RATING TO STARS (USED ON GAME DETAILS)
export const convertToStars = (rating: number) => {
  const newR: JSX.Element[] = [];
  const whole = Math.floor(rating); //2
  const remainder = rating - whole; // 2.35
  let percentage_r = remainder * 100 + "%"; //35%
  let counter = 0;

  if (rating < 3) {
    for (let i = 0; i < whole; i++) {
      newR.push(
        <IoStarSharp
          key={i}
          style={{
            background: "darkorange",
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }

    if (remainder > 0) {
      newR.push(
        <IoStarSharp
          key="rest"
          style={{
            background: `linear-gradient(to right, darkorange ${percentage_r}, grey 15%)`,
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }
  } else if (rating >= 3 && rating < 4) {
    for (let i = 0; i < whole; i++) {
      newR.push(
        <IoStarSharp
          key={i}
          style={{
            background: "#32CD32",
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }

    if (remainder > 0) {
      newR.push(
        <IoStarSharp
          key="rest"
          style={{
            background: `linear-gradient(to right, #32CD32 ${percentage_r}, grey 15%)`,
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }
  } else {
    for (let i = 0; i < whole; i++) {
      newR.push(
        <IoStarSharp
          key={i}
          style={{
            background: "darkgreen",
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }

    if (remainder > 0) {
      newR.push(
        <IoStarSharp
          key="rest"
          style={{
            background: `linear-gradient(to right, darkgreen ${percentage_r}, grey 15%)`,
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }
  }

  for (let i = counter; i < 5; i++) {
    newR.push(
      <IoStarSharp
        key={i}
        style={{
          background: "grey",
          fontSize: "24px",
          padding: "2px",
        }}
      />
    );
  }

  return newR;
};

//FUNCTION TO FETCH GAME INFORMATION (USED ON PAGE UNDER NAME)
export const getGameInfoByName = async (name: string) => {
  const res = await fetch(basePosterUrl + "/" + name + "?" + apiPosterKey);
  const data = await res.json();
  return data;
};

//FUNCTIONS TO FETCH USER REVIEWS ON ALL USERS BASED ON GAME
export const getUserReviews = async (allUsers: User[], gameId: number) => {
  // Process all users asynchronously and return reviews filtered by gameId
  const gameReviews = allUsers
    ?.flatMap((user) =>
      (user.user_reviews || []).map((review) => ({
        ...review,
        username: user.username || user.name,
      }))
    ) // Flatten all user reviews from each user
    .filter((review) => review.gameId === gameId) // Filter reviews by gameId
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return gameReviews;
};

//FUNCTION TO FETCH GAME SCREENSHOTS
export async function getScreenshots(slug: string) {
  try {
    const res = await fetch(
      `${basePosterUrl}/${slug}/screenshots?${apiPosterKey}`,
      {
        // Adding no-store ensures fresh data on each request if needed
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch screenshots: ${res.statusText}`);
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return undefined;
  }
}
