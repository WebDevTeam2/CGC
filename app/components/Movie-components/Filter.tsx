"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

interface Genre {
  id: number;
  name: string;
}

const Filter = () => {
  const [isActive, setIsActive] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Number[]>([]); //Gia na mporei o xrhsths na dialegei perissotera eidh tainiwn

  useEffect(() => {
    const fetchMovieGenres = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=a48ad289c60fd0bb3fc9cc3663937d7b`
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
    if (selectedGenres.length === 0) return "/Movies/moviePage/1"; // Default
    return `/Movies/Genres/${selectedGenres.join(",")}/1`;
  };

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <div className="flex justify-end mr-10 mt-2">
        <div
          className="cursor-pointer p-[0.2rem] bg-[#4c545b] text-[#d1d1d1] rounded-md"
          onClick={handleClick}
        >
          <FaFilter style={{ flexShrink: 0, fontSize: "1.4rem" }} />
        </div>
        {isActive && (
          <ul
            className={`absolute right-0 z-10 mt-[1.7rem] bg-[#4c545b] rounded-md shadow-lg transition-all duration-200 ease-in-out ${
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {genres.map((movieGenre) => (
              <li
                className={`hover:opacity-75 mb-2 cursor-pointer transition duration-200 ${
                  selectedGenres.includes(movieGenre.id)
                    ? "font-bold bg-white text-black"
                    : "text-white "
                }`}
                key={movieGenre.id}
                onClick={() => handleGenreClick(movieGenre.id)}
              >
                {movieGenre.name}
              </li>
            ))}
            <li className="text-white bg-blue-800 rounded-md p-2 hover:opacity-75 transition duration-400 cursor-pointer">
              <Link href={buildGenreFilterLink()}>
                Search
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Filter;
