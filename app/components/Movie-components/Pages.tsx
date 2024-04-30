"use client";
import Link from "next/link";
import { useState } from "react";

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Pages = () => {
  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage((prevPage) => {
      if (prevPage < pages.length) {
        return prevPage + 1;
      } else {
        return prevPage;
      }
    });
  };

  const previousPage = () => {
    setPage((prevPage) => {
      if (prevPage > 1) {
        return prevPage - 1;
      } else {
        return prevPage;
      }
    });
  };
  return (
    <div className="flex flex-row ml-[25rem] gap-2 text-lg">
      {}
      {pages.map((pageNumber) => (
        <div key={pageNumber}>
          <Link href={`/Movies/moviePage/${pageNumber}`}>{pageNumber}</Link>
        </div>
      ))}
    </div>
  );
};

export default Pages;
