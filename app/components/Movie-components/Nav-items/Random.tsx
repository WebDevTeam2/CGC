import Link from "next/link";
import { TiArrowShuffle } from "react-icons/ti";
import { useState, useEffect } from "react";

interface MovieDetails {
  id: number;
}

const Random = () => {
  const [movieData, setMovieData] = useState<MovieDetails[]>([]);   //Vazw ola ta ids apo tis tainies tou json se ena array
  const [randomId, setRandomId] = useState<number>(2);       

  useEffect(() => {
    fetch("/data/movie_ids_04_24_2024.json")
      .then((res) => res.text())
      .then((data) => {
        const lines = data.trim().split("\n");
        const movies: MovieDetails[] = lines.map((line: string) =>
          JSON.parse(line)
        );
        setMovieData(movies);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getRandomId = () => {
    if (movieData.length > 0) {
      const randomIndex = Math.floor(Math.random() * movieData.length);
      const randomMovie = movieData[randomIndex];
      setRandomId(randomMovie.id);
    }
  };

  return (
    <div>
      <Link
        onClick={getRandomId}
        className="flex flex-row items-center h-20 gap-2 not-search"
        href={`/Movies/${randomId}`}
      >
        <TiArrowShuffle style={{ margin: "0 1.5rem", flexShrink: 0 }} />
        <span className="opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-6 not-search">
          Random
        </span>
      </Link>
    </div>
  );
};

export default Random;
