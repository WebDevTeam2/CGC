//import movieTitles from '@/app/constants/movieTitles'
import React, { useEffect, useState } from "react";

const Search = () => {
  return (
    <form className="w-[440px] absolute top-20 left-1/2 transform -translate-x-1/2 searchbar">
        <div className="relative">
            <input type="search" placeholder="Search..." className="w-full rounded-full text-white p-4 bg-slate-800"/>
        </div>
    </form>
  );
};

export default Search;
