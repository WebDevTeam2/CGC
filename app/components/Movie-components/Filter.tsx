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
              <li className="text-white mb-2" key={movieGenre.id}>
                <Link href={`/Movies/Genres/${movieGenre.id}/1`}>
                  {movieGenre.name}{" "}
                </Link>
              </li>
            ))}
            <li>Search</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Filter;
