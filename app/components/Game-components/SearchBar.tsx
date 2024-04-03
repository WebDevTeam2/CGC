"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

// Define an interface for the structure of each post
interface Post {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
}

// Specify the type of the 'posts' prop using the 'Post' interface
interface Props {
  posts: Post[];
  //  onSearch: (postTitle: string) => void;
}

const SearchBar: React.FC<Props> = ({ posts }) => {
  const [search, setSearch] = useState<Post[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to manage input value // State to manage input value
  const [visible, setVisible] = useState(false);
  const resultsRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const mouseHandler = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setTimeout(() => {
          setVisible(false);
        }, 50);
      }
    };

    document.addEventListener("mousedown", mouseHandler);
    return () => {
      document.removeEventListener("mousedown", mouseHandler);
    };
  }, []);

  useEffect(() => {
    let selectedIndex = -1;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && selectedIndex < search.length - 1)
        selectedIndex++;
      else if (e.key === "ArrowUp" && selectedIndex > 0) selectedIndex--;
      if (selectedIndex !== -1) setInputValue(search[selectedIndex].title);
    };
    const inputElement = document.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;
    inputElement.addEventListener("keydown", handleKey);

    return () => {
      inputElement.removeEventListener("keydown", handleKey);
    };
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setVisible(true);
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue === "") {
      setSearch([]);
    } else {
      setSearch(
        posts
          .filter((post) => post.title.toLowerCase().startsWith(lowercaseValue))
          .slice(0, 8)
      );
    } // Update search results
  };

  //function to auto complete the input if user clicks on title
  const handleAutoComplete = (selected: string) => {
    setSearch([]);
    setInputValue(selected);
  };

  const handleClick = () => {
    // onSearch(inputValue);
  };

  return (
    <form
      className="flex relative items-center justify-center z-10"
      ref={resultsRef}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="fixed top-0 w-3/6 transition-all duration-500 md:w-2/6 p-3 text-lg">
        <input
          type="search"
          placeholder="Type Here"
          className="subpixel-antialiased w-full p-2 outline-none rounded-full bg-slate-200 pl-6 pr-11 text-slate-600"
          onChange={handleInputChange}
          value={inputValue}
        />
        <div
          className="absolute left-3 top-16 bg-black text-white rounded-2xl w-[93%]"
          style={{
            height:
              visible && search.length > 0 ? `${search.length * 2.55}rem` : "0",
            transition: "height 0.2s ease-in-out",
            overflow: "hidden",
          }}
        >
          {search.map((result, index) => (
            <span
              className="py-1.5 cursor-pointer flex flex-col pl-6 hover:scale-105 hover:text-stone-400 transition-all duration-300 ease-in-out"
              key={index}
              onClick={() => handleAutoComplete(result.title)}
            >
              {result.title}
            </span>
          ))}
        </div>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-zinc-300 rounded-full hover:scale-110 transition duration-200"
          onClick={handleClick}
        >
          <AiOutlineSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
