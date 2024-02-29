"use client";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

// Define an interface for the structure of each post
interface Post {
  id: number;
  title: string;
  wikipediaPage: string;
  href: string;
}

// Specify the type of the 'posts' prop using the 'Post' interface
interface Props {
  posts: Post[];
}

const SearchBar: React.FC<Props> = ({ posts }) => {
  const [search, setSearch] = useState<Post[]>([]); // State to manage search results
  const [inputValue, setInputValue] = useState(""); // State to manage input value // State to manage input value

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue === "") setSearch([]);
    else {
      setSearch(
        posts
          .filter((post) => post.title.toLowerCase().includes(lowercaseValue))
          .slice(0, 8)
      );
    } // Update search results
  };

  return (
    <form className="flex relative items-center justify-center z-10">
      <div className="fixed top-0 w-3/6 transition-all duration-500 md:w-2/6 p-3 text-lg">
        <input
          type="search"
          placeholder="Type Here"
          className="subpixel-antialiased w-full p-2 outline-none rounded-full bg-slate-200 pl-6 pr-11 text-slate-600"
          onChange={handleInputChange}
          value={inputValue}
        />
        {/* {search.length > 0 && ( */}
        <div
          className="absolute pt-2 rounded-lg w-[95%] text-white bg-black"
          style={{
            height: search.length > 0 ? `${search.length * 2.5}rem` : "0",
            transition: "height 0.2s ease-in-out",
          }}
        >
          {search.map((result, index) => (
            <div className="pb-2 pl-3" key={index}>
              {result.title}
            </div>
          ))}
        </div>
        {/* )} */}
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-zinc-300 rounded-full hover:scale-110 transition duration-200">
          <AiOutlineSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
