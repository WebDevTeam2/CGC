"use client";
import React, { useState } from "react";
import Link from "next/link";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
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

interface SortProps {
  onSort: (sortFunc: (games: PostResult[]) => PostResult[]) => void;
}

const sortGamesByRating = (games: PostResult[]) => {
  return games.sort((a, b) => b.rating - a.rating);
};

const sortGamesByRelease = (games: PostResult[]) => {
  return games.sort((a, b) => {
    const dateA = new Date(a.released);
    const dateB = new Date(b.released);
    return dateB.getTime() - dateA.getTime();
  });
};

const Sort = ({ onSort }: SortProps) => {
  return (
    <div className="justify-center grid mt-12">
      {/* sort by */}
      <div className="flex justify-center flex-col">
        <button
          id="dropdownDelayButton"
          data-dropdown-toggle="dropdownDelay"
          data-dropdown-delay="200"
          data-dropdown-trigger="hover"
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700"
          type="button"
        >
          Sort By:
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        {/* <!-- Dropdown menu --> */}
        <div
          id="dropdownDelay"
          className="bg-white rounded-lg shadow w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 divide-y text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDelayButton"
          >
            <li>
              <Link
                href="#"
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => onSort(sortGamesByRating)}
              >
                Rating
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className=" px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => onSort(sortGamesByRelease)}
              >
                Release Date
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* end of sort by */}
    </div>
  );
};

export default Sort;
