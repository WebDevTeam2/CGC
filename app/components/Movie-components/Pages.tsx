"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

// ΝΟΤΕ: TO PAGE DEN KANEI UPDATE SWSTA
// TO SETPAGE KANEI UPDATE THN SELIDA KAI META APO LIGO EPANERXETAI STO 1
// STEFANE VOHTHEIA THA TO SPASW

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Pages = () => {
  const [page, setPage] = useState(1);

  const goToPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const nextPage = () => {
    if (page < pages.length) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      
    }
  };

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <div className="flex flex-row ml-[25rem] gap-2 text-lg">
      {pages.map((pageNumber) => (
        <div key={pageNumber}>
          <Link
            onClick={() => goToPage(pageNumber)}
            href={`/Movies/moviePage/${pageNumber}`}
          >
            {pageNumber}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Pages;
