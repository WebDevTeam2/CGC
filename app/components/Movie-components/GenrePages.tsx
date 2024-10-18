"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GenrePages = () => {
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname) {
      const pathParts = pathname.split("/"); //Epeidh einai 2 ta kommatia pou theloume kanoume split, 1 komamti to page kai 1 to genreId
      const currentPage = parseInt(pathParts.pop() || ""); // Gia na paroume to page number apo to url
      const currentGenre = pathParts.pop(); // Get the second last part of the URL as the genre

      //An to currentPage yparxei tote kanoume set to page
      if (!isNaN(currentPage) && currentPage !== page) {
        setPage(currentPage);
      }
      //An to currentGenre yparxei tote kanoume set to genre
      if (currentGenre && currentGenre !== genre) {
        setGenre(currentGenre);
      }
    }
  }, [page, genre]); //Ayto to useEffect to kaloume kathe fora pou allazei to page h to genre

  return (
    <div className="flex flex-row mb-2 mt-1 ml-[40rem] gap-4 text-lg not-search">
      {page > 1 && (
        <Link
          className="hover:opacity-[0.5] transition duration-200"
          href={`/Movies/Genres/${genre}/${page - 1}`}
        >
          {"<"}
        </Link>
      )}
      {pages.map((pageNumber) => (
        <div key={pageNumber}>
          <Link
            href={`/Movies/Genres/${genre}/${pageNumber}`}
            className={`${
              pageNumber === page
                ? "current-page w-[1.7rem] h-[1.7rem] flex items-center justify-center text-white rounded-full bg-[#4c545b]"
                : "other"
            } hover:opacity-[0.5] transition duration-200`} // Target the current page with styles
          >
            {pageNumber}
          </Link>
        </div>
      ))}
      {/* {page < 10 && ( */}
        <Link
          className="hover:opacity-[0.5] transition duration-200"
          href={`/Movies/Genres/${genre}/${page + 1}`}
        >
          {">"}
        </Link>
      {/* )} */}
    </div>
  );
};

export default GenrePages;
