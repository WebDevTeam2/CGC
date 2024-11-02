export const pageSize = 15;

//base TMDB URLs
export const imageURL = "https://image.tmdb.org/t/p/w500";
export const baseUrl = "https://api.themoviedb.org/3/";

//TMDB api fetch options
export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 1000 },
};

//TMDB api fetch options for client pages
export const clientOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 1000 },
};

//function used in Movies to get the color based on vote average
export const getVotecolor = (vote: number) => {
  if (vote >= 7) return "text-green-500";
  if (vote >= 6) return "text-yellow-500";
  return "text-red-500";
};

//interfaces used throught the movie pages
export interface MovieProps {
  movieData?: Movie;
  movieResultData?: MovieResult[];
  upcoming?: boolean; //prop used to tell if the page has upcoming movies or not
}

export interface Movie {
  page: number;
  results: MovieResult[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
export interface MovieResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TVShowProps {
  tvShowData: TVShows;
  upcoming?: boolean; // optional prop used to tell if the page has upcoming shows or not
}

export interface TVShows {
  page: number;
  results: TVResult[];
}

export interface TVDetails {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  air_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  seasons: Seasons[];
}

export interface TVResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Seasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}
