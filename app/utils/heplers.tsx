interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Post {
  page: number;
  results: PostResult[];
  onSearch: (name: string) => void;
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
  description_raw: string;
  parent_platforms: Platform[];
}

// export const extractPlatformFromUrl = (url: string): number | null => {
//   const platformMap: { [key: string]: number } = {
//     pc: 1,
//     playstation: 2,
//     xbox: 3,
//     nintendo: 7,
//   };
//   const platformMatch = url.match(/\/Games\/([^/]+)\//);
//   const platform = platformMatch ? platformMatch[1] : null;
//   return platform ? platformMap[platform] : null;
// };

const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=076eda7a1c0e441eac147a3b0fe9b586";
const apiPosterUrl = `${basePosterUrl}?${apiPosterKey}`;

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
    return data.results;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

export const getGameDetails = async (
  game: PostResult,
  platformId: number | null
) => {
  try {
    const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
    if (!gameRes.ok) {
      throw new Error(`HTTP error! status: ${gameRes.status}`);
    }
    const gameData = await gameRes.json();

    const platformIds = gameData.parent_platforms.map(
      (p: { platform: { id: number } }) => p.platform.id
    );
    const isAvailable = platformId !== null && platformIds.includes(platformId);

    if (isAvailable) {
      return { ...game, description_raw: gameData.description_raw };
    }
    return null;
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
};

// const fetchGameDataWithDetails = async (
//   url: string,
//   page: number,
//   platformId: number | null
// ) => {
//   try {
//     const games = await getGameData(url, page);
//     const gameDetailsPromises = games.map((game: PostResult) =>
//       getGameDetails(game, platformId)
//     );
//     const gameDetails = await Promise.all(gameDetailsPromises);
//     return gameDetails.filter((game: PostResult) => game !== null);
//   } catch (error) {
//     console.error("Error fetching game data with details:", error);
//     throw error;
//   }
// };

// const getGameData = async (
//   url: string,
//   page: number,
//   platformId: number | null
// ) => {
//   try {
//     const res = await fetch(`${url}&page=${page}`);
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     const data = await res.json();
//     if (!data || !data.results) {
//       throw new Error("Invalid data structure");
//     }

//     const gameDetailsPromises = data.results.map(async (game: PostResult) => {
//       const gameRes = await fetch(
//         `${basePosterUrl}/${game.id}?${apiPosterKey}`
//       );
//       if (!gameRes.ok) {
//         throw new Error(`HTTP error! status: ${gameRes.status}`);
//       }
//       const gameData = await gameRes.json();

//       const platformIds = gameData.parent_platforms.map(
//         (p: { platform: { id: number } }) => p.platform.id
//       );
//       const isAvailable =
//         platformId !== null && platformIds.includes(platformId);

//       if (isAvailable) {
//         return { ...game, description_raw: gameData.description_raw };
//       }
//       return null;
//     });

//     const gameDetails = await Promise.all(gameDetailsPromises);

//     return {
//       ...data,
//       results: gameDetails.filter((game: PostResult) => game !== null),
//     };
//   } catch (error) {
//     console.error("Error fetching game data:", error);
//     throw error;
//   }
// };

export const fetchAndCombineData = async () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2005;
  const endYear = currentYear;
  const dateRanges: string[] = [];

  // Create an array of date ranges (e.g., every 5 years)
  for (let year = startYear; year <= endYear; year += 5) {
    const endRangeYear = Math.min(year + 4, endYear);
    dateRanges.push(`${year}-01-01,${endRangeYear}-12-31`);
  }

  const allGames: PostResult[] = [];

  // Fetch and combine data for each date range
  for (const dateRange of dateRanges) {
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const dateRangeUrl: string = `${apiPosterUrl}&dates=${dateRange}&page=${page}`;
      const gameResults: PostResult[] = await getGameData(dateRangeUrl, page);
      allGames.push(...gameResults);

      // Check if there are more pages of data
      hasMoreData = gameResults.length > 0;
      page += 1;
    }
  }

  return allGames;
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
