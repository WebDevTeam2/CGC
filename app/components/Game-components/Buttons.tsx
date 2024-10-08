"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { pageSize } from "@/app/constants/constants";

const Buttons = ({ gamesLength }: { gamesLength: number }) => {
  const totalPages = Math.ceil(gamesLength / pageSize);
  let buttons = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [page, setPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  const startingYear = 2024;
  let currentYear = new Date().getFullYear();
  let yearsPassed = currentYear - startingYear;

  // Add a new button for each year that has passed
  for (let i = 0; i < yearsPassed; i++) {
    if (buttons.length < totalPages) {
      buttons.push(buttons.length + 1);
    }
  }
  // console.log(buttons.length);
  //Xrhsimopoioume ayto to useEffect gia na paroume to page number mesa apo to URL
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname) {
      const currentPage = parseInt(pathname.split("/").pop() || ""); //Gia na paroume to page number apo to url
      //An to currentPage yparxei tote kanoume set to page
      if (!isNaN(currentPage) && currentPage !== page) {
        setPage(currentPage);
      }
    }
  }, [page]);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine the range of page buttons to display
  const getPageRange = () => {
    // returning 3 first pages
    if (page === 1) {
      return buttons.slice(0, 3);
    }
    // returning 4 first
    else if (page === 2) {
      return buttons.slice(0, 4);
    }
    // returning 3 last pages
    else if (page === buttons.length) {
      return buttons.slice(-3);
    }
    // returning 4 last
    else if (page > buttons.length - 2) {
      return buttons.slice(buttons.length - 4);
    } else if (windowWidth !== undefined && windowWidth < 450) {
      // For screens below 450px, return [page - 1, page, page + 1]
      return [page - 1, page, page + 1];
    } else {
      return [page - 2, page - 1, page, page + 1, page + 2];
    }
  };
  const pageRange = getPageRange();

  return (
    <div className="relative text-white my-5 flex flex-row items-center justify-center gap-4 max-[450px]:gap-2 transition-all duration-200">
      {page > 3 && (
        <Link href="1">
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md bg-stone-600 border-stone-600">
            {"<<"}
          </button>
        </Link>
      )}
      {page > 1 && (
        <Link href={`${Math.max(page - 1, 1)}`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md bg-stone-600 border-stone-600">
            {"<"}
          </button>
        </Link>
      )}
      {pageRange.map((item, index) => (
        <Link
          href={`${item}`}
          key={index}
          className={`hover:scale-110 transition-all duration-200 border-none py-1.5 px-3 rounded-md  bg-stone-600 ${
            item === page ? "bg-stone-800" : ""
          }`}
        >
          {item}
        </Link>
      ))}
      {page < buttons.length && (
        <Link href={`${Math.min(page + 1, buttons.length)}`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
            {">"}
          </button>
        </Link>
      )}
      {page < buttons.length - 2 && (
        <Link href={`${buttons.length}`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
            {">>"}
          </button>
        </Link>
      )}
    </div>
  );
};

export default Buttons;
