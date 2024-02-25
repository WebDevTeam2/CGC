import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  return (
    <form className="flex relative w-full justify-center">
      <div className="relative w-3/6 transition-all duration-500 md:w-2/6 p-3 text-lg">
        <input
          type="search"
          placeholder="Type Here"
          className="subpixel-antialiased w-full p-2 outline-none rounded-full bg-slate-200 pl-6 pr-11 text-slate-600"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-stone-400 rounded-full hover:scale-110 transition duration-200">
          <AiOutlineSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
