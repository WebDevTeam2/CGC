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

//this works for the main page games
export const fetchAndCombineDataSimple = async () => {
  const currentYear: number = new Date().getFullYear();
  const startYear: number = 2005;
  const endYear: number = currentYear;
  const dateRanges: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    dateRanges.push(`${year}-01-01,${year}-12-31`);
  }
  const allGames: PostResult[] = [];

  // Fetch and combine data for each date range
  for (const dateRange of dateRanges) {
    let page = 1;
    try {
      const dateRangeUrl = `${apiPosterUrl}&dates=${dateRange}`;
      console.log(`Fetching data for date range: ${dateRange}, page: ${page}`);
      const gameResults = await getGameData(dateRangeUrl, page);
      const slicedResults = gameResults.slice(0, 10);
      allGames.push(...slicedResults);
    } catch (error) {
      console.error(`Error fetching data for range ${dateRange}:`, error);
    }
  }
  shuffleArray(allGames);
  return allGames;
};

//this works for the company page games
export const fetchAndCombineData = async (name: string) => {
  const platformId = platformIds[name.toLowerCase()];
  if (!platformId) {
    throw new Error(`Invalid platform name: ${name}`);
  }
  const currentYear: number = new Date().getFullYear();
  const startYear: number = 2005;
  const endYear: number = currentYear;
  const dateRanges: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    dateRanges.push(`${year}-01-01,${year}-12-31`);
  }
  const allGames: PostResult[] = [];

  // Fetch and combine data for each date range
  for (const dateRange of dateRanges) {
    let page = 1;
    try {
      const dateRangeUrl = `${apiPosterUrl}&dates=${dateRange}&parent_platforms=${platformId}`;
      console.log(`Fetching data for date range: ${dateRange}, page: ${page}`);
      const gameResults = await getGameData(dateRangeUrl, page);
      const slicedResults = gameResults.slice(0, 10);
      allGames.push(...slicedResults);
    } catch (error) {
      console.error(`Error fetching data for range ${dateRange}:`, error);
    }
  }
  shuffleArray(allGames);
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
