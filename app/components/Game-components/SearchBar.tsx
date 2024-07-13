"use client";
import { AiOutlineSearch } from "react-icons/ai";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

const SearchBar = ({ games }: { games: PostResult[] }) => {
  const [search, setSearch] = useState<PostResult[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to manage input value // State to manage input value
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // State to manage the selected index
  const resultsRef = useRef<HTMLFormElement>(null);

  //handle case as you are writting in the search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setVisible(true);
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue === "") {
      setSearch([]);
      setSelectedIndex(-1);
    } else {
      const filteredGames = games
        .filter((game) =>
          game.name
            .toLowerCase()
            .replaceAll(".", "")
            .replaceAll("'", "")
            .startsWith(lowercaseValue)
        )
        .slice(0, 12);

      setSearch(filteredGames);
      setSelectedIndex(-1);
    } // Update search results
  };

  //check if clicked outside of input container
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

  // keys and enter functionality when rendering results
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
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault(); // Prevent form submission
        const selectedResult = search[selectedIndex];
        if (selectedResult) {
          window.location.href = `/Games/${selectedResult.slug}`;
        }
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
  }, [search, selectedIndex]);

  //function to auto complete the input if user clicks on title
  const handleAutoComplete = (selected: string) => {
    setSearch([]);
    setInputValue(selected);
    setSelectedIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedIndex >= 0 && search[selectedIndex]) {
      window.location.href = `/Games/${search[selectedIndex].slug}`;
    }
  };

  return (
    <form
      className="fixed top-0 h-[10vh] w-[30vw] mx-[35vw] z-10"
      ref={resultsRef}
      onSubmit={handleSubmit}
    >
      <div className="sticky top-4 w-full text-lg">
        <input
          type="search"
          placeholder="Type Here"
          className="subpixel-antialiased h-[6vh] w-full outline-none rounded-full bg-slate-200 pl-10 pr-11 text-slate-600"
          onChange={handleInputChange}
          value={inputValue}
        />
        <div
          className="absolute left-3 top-16 bg-black text-white rounded-2xl w-[93%]"
          style={{
            height:
              visible && search.length > 0 ? `${search.length * 4.2}rem` : "0",
            transition: "height 0.2s ease-in-out",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {search.map((result, index) => (
            <Link
              key={index}
              href={`/Games/${result.slug}`}
              className="flex items-center  flex-row transition-all duration-300 ease-in-out hover:scale-105 pl-3 hover:text-stone-400"
            >
              <div className="relative overflow-hidden p-16 -mb-8">
                <Image
                  src={result.background_image}
                  alt={result.name}
                  fill={true}
                  objectFit="contain"
                />
              </div>
              <div
                onClick={() => handleAutoComplete(result.name)}
                className="search-result py-1.5 cursor-pointer flex flex-col pl-6 "
              >
                {result.name}
              </div>
            </Link>
          ))}
        </div>
        <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 pointer-events-none">
          <AiOutlineSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
