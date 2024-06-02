"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const UpComingTvShowsPages = () => {
  const [page, setPage] = useState(1);

  //Xrhsimopoioume ayto to useEffect gia na paroume to page number mesa apo to URL
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname) {
      const currentPage = parseInt(pathname.split("/").pop() || "");  //Gia na paroume to page number apo to url
      //An to currentPage yparxei tote kanoume set to page
      if (!isNaN(currentPage) && currentPage !== page) {
        setPage(currentPage);
      }
    }
  }, []);
  return (
    <div className="flex flex-row mb-2 mt-1 ml-[40rem] gap-4 text-lg not-search">
      <Link
        className="hover:opacity-[0.5] transition duration-200"
        href={`/Movies/TVShows/Upcoming-tvshows/${page - 1}`}
      >
        {"<"}
      </Link>
      {pages.map((pageNumber) => (
        <div key={pageNumber}>
          <Link
            href={`/Movies/TVShows/Upcoming-tvshows/${pageNumber}`}
            className={`${
              pageNumber === page
                ? "current-page p-1 text-white rounded-full bg-[#4c545b]"
                : "other"
            } hover:opacity-[0.5] transition duration-200`} //Kanoume target me styles to page pou vrisketai o xrhsrhs
          >
            {pageNumber}
          </Link>
        </div>
      ))}
      <Link
        className="hover:opacity-[0.5] transition duration-200"
        href={`/Movies/TVShows/Upcoming-tvshows/${page + 1}`}
      >
        {">"}
      </Link>
    </div>
  );
};

export default UpComingTvShowsPages;
