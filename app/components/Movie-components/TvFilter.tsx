"use client";
import { options } from "@/app/constants/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaLessThan, FaGreaterThan } from "react-icons/fa";

interface TvGenre {
  id: number;
  name: string;
}

const TvFilter = () => {
  const [isActive, setIsActive] = useState(false);
  const [genres, setGenres] = useState<TvGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]); // Use lowercase `number[]`

  useEffect(() => {
    const fetchMovieGenres = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?language=en&${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`, options
      );
      const data = await res.json();
      setGenres(data.genres);
    };

    fetchMovieGenres();
  }, []);

  const handleGenreClick = (genreId: number) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId)
        ? prevGenres.filter((id) => id !== genreId)
        : [...prevGenres, genreId]
    );
  };

  const buildGenreFilterLink = () => {
    if (selectedGenres.length === 0) return "/Movies/TVShows/TVShowsPage/1";
    return `/Movies/TVShows/Genres/${selectedGenres.join(",")}/1`;
  };

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <div className="fixed right-0 top-[50%] translate-y-[-50%] z-20">
        <div
          className={`cursor-pointer p-1 transition duration-500 hover:opacity-40 bg-[#4c545b] text-[#d1d1d1] rounded-lg ${
            isActive ? "translate-x-[-290px]" : ""
          }`}
          onClick={handleClick}
        >
          {isActive ? (
            <FaGreaterThan style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          ) : (
            <FaLessThan style={{ flexShrink: 0, fontSize: "1.4rem" }} />
          )}
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-[#23232e] p-4 z-20 transition duration-500 ease-in-out ${
          isActive ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="grid grid-cols-2 gap-2">
          {genres.map((movieGenre) => (
            <li
              className={`hover:opacity-75 mb-2 text-center rounded-full p-2 cursor-pointer transition duration-200 ${
                selectedGenres.includes(movieGenre.id)
                  ? "font-bold bg-blue-500 text-white"
                  : "text-[#c7c7c7] bg-[#6B6B6B]"
              }`}
              key={movieGenre.id}
              onClick={() => handleGenreClick(movieGenre.id)}
            >
              {movieGenre.name}
            </li>
          ))}
        </ul>
        <Link href={buildGenreFilterLink()}>
          <div className="text-white bg-blue-800 rounded-full p-2 text-center hover:opacity-75 transition duration-400 cursor-pointer">
            Search
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TvFilter;
