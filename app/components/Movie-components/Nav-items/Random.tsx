import Link from "next/link";
import { TiArrowShuffle } from "react-icons/ti";
import { useState, useEffect } from "react";

interface MovieDetails {
  id: number;
}

const Random = () => {
  const [movieData, setMovieData] = useState<MovieDetails[]>([]);
  const [randomId, setRandomId] = useState<number | null>(null); // Initialize randomId as null

  useEffect(() => {
    // Fetch movie data
    fetch("/data/movie_ids_04_24_2024.json")
      .then((res) => res.text())
      .then((data) => {
        const lines = data.trim().split("\n");  //To read the lines in the json file
        const movies: MovieDetails[] = lines.map((line: string) =>
          JSON.parse(line)
        );
        setMovieData(movies); // Set movie data        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getRandomId = () => {
    if (movieData.length > 0) {
      const randomIndex = Math.floor(Math.random() * movieData.length);
      const randomMovie = movieData[randomIndex];
      setRandomId(randomMovie.id); // Set the random movie ID
    }
  };

  return (
    <Link
      onClick={getRandomId} // Clicking sets a new randomId
      className="flex flex-row items-center h-20 gap-2 not-search"
      href={randomId ? `/Movies/${randomId}` : "#"} // Avoid broken link if randomId is null
    >
      <TiArrowShuffle style={{ margin: "0 1.5rem", flexShrink: 0 }} />
      <span className="sm:block md:block lg:hidden transition duration-700 ease-in-out ml-2 not-search">
        Random
      </span>
    </Link>
  );
};

export default Random;
