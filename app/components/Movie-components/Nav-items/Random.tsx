import Link from "next/link";
import { TiArrowShuffle } from "react-icons/ti";
import { useState, useEffect } from "react";

//API DATA
const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const TODAY = new Date().toISOString().split("T")[0];

interface MovieDetails {
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

interface Genre {
  id: number;
  name: string;
}

const Random = () => {
  const [movieData, setMovieData] = useState<number[]>([]);
  const [randomId, setRandomId] = useState<number | null>(2);

  useEffect(() => {
    fetch('../../Movies/data/movie_ids_04_24_2024.json')
      .then(res => res.text())
      .then((data) => {
        const lines = data.trim().split("\n");
        const movies: MovieDetails[] = lines.map((line: string) =>
          JSON.parse(line)
        );
        setMovieData(movies.map((movie) => movie.id));
      })

      .catch(err => {
        console.log(err);
      });
  }, []);

  const getRandomId = () => {
    const randomIndex = Math.floor(Math.random() * movieData.length);
    const randomMovie =  movieData[randomIndex];
    setRandomId(randomMovie);
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
