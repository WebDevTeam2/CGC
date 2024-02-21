import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  return (
    <form className="flex relative w-full justify-center">
      <div className="relative w-1/4 p-3 text-lg">
        <input
          type="search"
          placeholder="Type Here"
          className="w-full p-2 outline-none rounded-full bg-slate-200 pl-6 text-slate-600"
        />
        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-3 bg-slate-400 rounded-full">
          <AiOutlineSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
