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

export const extractPlatformFromUrl = (url: string): number | null => {
  const platformMap: { [key: string]: number } = {
    pc: 1,
    playstation: 2,
    xbox: 3,
    nintendo: 7,
  };
  const platformMatch = url.match(/\/Games\/([^/]+)\//);
  const platform = platformMatch ? platformMatch[1] : null;
  return platform ? platformMap[platform] : null;
};

const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=076eda7a1c0e441eac147a3b0fe9b586";
const apiPosterUrl = `${basePosterUrl}?${apiPosterKey}`;

const getGameData = async (
  url: string,
  page: number,
  platformId: number | null
) => {
  try {
    const res = await fetch(`${url}&page=${page}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data.results) {
      throw new Error("Invalid data structure");
    }

    const gameDetailsPromises = data.results.map(async (game: PostResult) => {
      const gameRes = await fetch(
        `${basePosterUrl}/${game.id}?${apiPosterKey}`
      );
      if (!gameRes.ok) {
        throw new Error(`HTTP error! status: ${gameRes.status}`);
      }
      const gameData = await gameRes.json();

      const platformIds = gameData.parent_platforms.map(
        (p: { platform: { id: number } }) => p.platform.id
      );
      const isAvailable =
        platformId !== null && platformIds.includes(platformId);

      if (isAvailable) {
        return { ...game, description_raw: gameData.description_raw };
      }
      return null;
    });

    const gameDetails = await Promise.all(gameDetailsPromises);

    return {
      ...data,
      results: gameDetails.filter((game: PostResult) => game !== null),
    };
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

export const fetchAndCombineData = async (platformId: number | null) => {
  const currentYear = new Date().getFullYear();
  const startYear = 2005;
  const endYear = currentYear;
  const topGamesPerYear = [];

  for (let year = endYear; year >= startYear; year--) {
    const yearUrl = `${apiPosterUrl}&dates=${year}-01-01,${year}-12-31`;
    const gameData: Post = await getGameData(yearUrl, 1, platformId);
    const top10Games = gameData.results.slice(0, 15);
    topGamesPerYear.push(...top10Games);
  }

  return topGamesPerYear;
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
