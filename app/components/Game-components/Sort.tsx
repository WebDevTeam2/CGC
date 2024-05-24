"use client";
import React from "react";
import Link from "next/link";

const Sort = () => {
  return (
    <div className="justify-center grid mt-12">
      {/* sort by */}
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
        className="group-hover:block hidden bg-white rounded-lg shadow w-44 dark:bg-gray-700"
      >
        <ul
          className="py-2 divide-y text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDelayButton"
        >
          <li>
            <Link
              href="#"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Rating
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className=" px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Release Date
            </Link>
          </li>
        </ul>
      </div>
      {/* end of sort by */}
    </div>
  );
};

export default Sort;
