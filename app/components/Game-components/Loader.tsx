"use client";
import React from "react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

const handleClick = () => {
  const load = document.querySelector(".load") as HTMLElement;
  if (load) load.style.display = "none";
};

const Loader = () => {
  return (
    <div className="relative w-full tablet:flex justify-center pt-[6.2vh] hidden">
      <button
        onClick={handleClick}
        className="load mix-blend-screen flex border-none rounded-t-full bg-slate-500 text-white text-lg justify-center items-center px-[2vw] py-[1vh] gap-1"
      >
        <span className="text-4xl">
          <MdKeyboardDoubleArrowDown />
        </span>
      </button>
    </div>
  );
};

export default Loader;
