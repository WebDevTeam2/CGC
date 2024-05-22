"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
} from "react-icons/ri";

const buttons = [
  { icon: <RiNumber1 />, page: 1 },
  { icon: <RiNumber2 />, page: 2 },
  { icon: <RiNumber3 />, page: 3 },
  { icon: <RiNumber4 />, page: 4 },
  { icon: <RiNumber5 />, page: 5 },
];

const Buttons = () => {
  const [page, setPage] = useState(1);
  //Xrhsimopoioume ayto to useEffect gia na paroume to page number mesa apo to URL
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname) {
      const currentPage = parseInt(pathname.split("/").pop() || ""); //Gia na paroume to page number apo to url
      //An to currentPage yparxei tote kanoume set to page
      if (
        !isNaN(currentPage) &&
        currentPage >= 1 &&
        currentPage <= 5 &&
        currentPage !== page
      ) {
        setPage(currentPage);
      }
    }
  }, [page]);

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
        <Link href={`${item.page}`} key={index}>
          <button className="hover:scale-110 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
            {item.icon}
          </button>
        </Link>
      ))}
      <Link href={`${Math.min(page + 1, 5)}`}>
        <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
          {">"}
        </button>
      </Link>
      <Link href={`5`}>
        <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
          {">>"}
        </button>
      </Link>
    </div>
  );
};

export default Buttons;
