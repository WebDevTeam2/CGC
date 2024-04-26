"use client";
import { AiOutlineSearch } from "react-icons/ai";
import { useRef, useEffect, useState } from "react";

// urls for the api
// https://api.rawg.io/api/games?key=f0e283f3b0da46e394e48ae406935d25
const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=f0e283f3b0da46e394e48ae406935d25";
const apiPosterUrl = basePosterUrl + "?" + apiPosterKey;

interface Props {
  onSearch: (name: string) => void;
}
interface PostResult {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  description: string;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [search, setSearch] = useState<PostResult[]>([]);
  const [originalSearch, setOriginalSearch] = useState<PostResult[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to manage input value // State to manage input value
  const [visible, setVisible] = useState(false);
  const resultsRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiPosterUrl);
        const data = await res.json();
        setOriginalSearch(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setVisible(true);
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue === "") {
      setSearch([]);
    } else {
      setSearch(
        originalSearch
          .filter((post) => post.name.toLowerCase().startsWith(lowercaseValue))
          .slice(0, 8)
      );
      console.log(search);
    } // Update search results
  };

  useEffect(() => {
    //if clicked outside of input container
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

  // keys functionality when rendering results
  useEffect(() => {
    let selectedIndex = -1;
    const spans = document.querySelectorAll(".search-result");
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && selectedIndex < search.length - 1) {
        selectedIndex++;
        //adding color for each selection
        spans.forEach((span, index) => {
          if (index === selectedIndex) {
            span.classList.add("text-stone-400");
          } else {
            span.classList.remove("text-stone-400");
          }
        });
      } else if (e.key === "ArrowUp" && selectedIndex > 0) {
        selectedIndex--;
        //adding color for each selection
        spans.forEach((span, index) => {
          if (index === selectedIndex) {
            span.classList.add("text-stone-400");
          } else {
            span.classList.remove("text-stone-400");
          }
        });
      }
      if (selectedIndex !== -1) {
        setInputValue(search[selectedIndex].name);
      }
    };

    const inputElement = document.querySelector(
      'input[type="search"]'
    ) as HTMLInputElement;

    if (inputElement) {
      inputElement.addEventListener("keydown", handleKey);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleKey);
      }
    };
  }, [search]);

  //function to auto complete the input if user clicks on title
  const handleAutoComplete = (selected: string) => {
    setSearch([]);
    setInputValue(selected);
  };

  const handleClick = () => {
    console.log(inputValue);
    onSearch(inputValue);
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
              key={index}
              onClick={() => handleAutoComplete(result.name)}
              className="search-result py-1.5 cursor-pointer flex flex-col pl-6 hover:scale-105 hover:text-stone-400 transition-all duration-300 ease-in-out"
            >
              {result.name}
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
