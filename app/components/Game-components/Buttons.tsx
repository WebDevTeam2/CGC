"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Buttons = () => {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const [page, setPage] = useState(1);
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
  }, []);

  return (
    <div className="relative text-white my-5 flex flex-row items-center justify-center gap-4 transition-all duration-200">
      <Link href={`1`}>
        <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
          {"<<"}
        </button>
      </Link>
      <Link href={`${Math.max(page - 1, 1)}`}>
        <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
          {"<"}
        </button>
      </Link>
      {buttons.map((item, index) => (
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
      <Link href={`${Math.min(page + 1, 9)}`}>
        <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
          {">"}
        </button>
      </Link>
      <Link href={`14`}>
        <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
          {">>"}
        </button>
      </Link>
    </div>
  );
};

export default Buttons;
