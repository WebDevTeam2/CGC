"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Genre {
  id: number;
  name: string;
  slug: string;
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
  genres: Genre[];
}

const Genres = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="pointer-events-none mt-2 group text-white relative flex flex-col items-center">
      <button
        className={`group-hover:bg-neutral-600 absolute left-0 pointer-events-auto rounded-2xl bg-neutral-500 px-10 py-3 text-lg border-none ${
          isOpen ? "rounded-b-sm" : "rounded-b-2xl"
        }`}
        onClick={toggleDropdown}
      >
        Genres
      </button>
      <div
        className={`pointer-events-auto divide-y text-lg rounded-b-2xl bg-neutral-100 text-black flex flex-col transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ visibility: isOpen ? "visible" : "hidden" }}
        onClick={closeDropdown}
      >
        {genres.map((genre) => (
          <Link key={genre.id} href={`/Games/${genre.slug}/page/1`}>
            <ul
              className="text-stone-200 sm:text-3xl text-2xl transition delay-50 p-2 rounded-full hover:scale-125"
              onClick={closeDropdown}
            >
              {genre.name}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
