export const pageSize = 15;

//TMDB API FETCH OPTIONS
export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 1000 },
};

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
