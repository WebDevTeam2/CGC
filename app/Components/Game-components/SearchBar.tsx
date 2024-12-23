"use client";
import { AiOutlineSearch } from "react-icons/ai";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";

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

interface SearchBarProps {
  games: PostResult[];
}

const convertToStars = (rating: number) => {
  const newR: JSX.Element[] = [];
  const whole = Math.floor(rating); //2
  const remainder = rating - whole; // 2.35
  let percentage_r = remainder * 100 + "%"; //35%
  let counter = 0;

  if (rating < 3) {
    for (let i = 0; i < whole; i++) {
      newR.push(
        <IoStarSharp
          key={i}
          style={{
            background: "darkorange",
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }

    if (remainder > 0) {
      newR.push(
        <IoStarSharp
          key="rest"
          style={{
            background: `linear-gradient(to right, darkorange ${percentage_r}, grey 15%)`,
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }
  } else if (rating >= 3 && rating < 4) {
    for (let i = 0; i < whole; i++) {
      newR.push(
        <IoStarSharp
          key={i}
          style={{
            background: "#32CD32",
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }

    if (remainder > 0) {
      newR.push(
        <IoStarSharp
          key="rest"
          style={{
            background: `linear-gradient(to right, #32CD32 ${percentage_r}, grey 15%)`,
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }
  } else {
    for (let i = 0; i < whole; i++) {
      newR.push(
        <IoStarSharp
          key={i}
          style={{
            background: "darkgreen",
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }

    if (remainder > 0) {
      newR.push(
        <IoStarSharp
          key="rest"
          style={{
            background: `linear-gradient(to right, darkgreen ${percentage_r}, grey 15%)`,
            fontSize: "24px",
            padding: "2px",
          }}
        />
      );
      counter++;
    }
  }

  for (let i = counter; i < 5; i++) {
    newR.push(
      <IoStarSharp
        key={i}
        style={{
          background: "grey",
          fontSize: "24px",
          padding: "2px",
        }}
      />
    );
  }

  return newR;
};

const SearchBar: React.FC<SearchBarProps> = ({ games }) => {
  const [search, setSearch] = useState<PostResult[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to manage input value // State to manage input value
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // State to manage the selected index
  const resultsRef = useRef<HTMLFormElement>(null);

  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  //handle case as you are writting in the search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setVisible(true);
    const lowercaseValue = value.toLowerCase();
    const searchElement = document.querySelector(".search") as HTMLElement;
    if (lowercaseValue === "") {
      setSearch([]);
      setSelectedIndex(-1);
      if (searchElement) {
        resetSearchElementStyles(searchElement);
      }
    } else {
      const filteredGames = games
        .filter((game) =>
          game.name
            .toLowerCase()
            .replaceAll(".", "")
            .replaceAll("'", "")
            .startsWith(lowercaseValue)
        )
        .slice(0, 6);

      setSearch(filteredGames);
      setSelectedIndex(-1);
      if (searchElement && window.innerWidth < 640) {
        goFull(searchElement);
      }
    } // Update search results
  };

  const resetSearchElementStyles = (element: HTMLElement) => {
    element.style.width = ""; // Reset width
    element.style.margin = "";
    element.style.padding = "";
    element.style.right = "";
  };
  const goFull = (element: HTMLElement) => {
    element.style.width = "100vw"; // Set width to 100vw
    element.style.margin = "0";
    element.style.right = "0";
    element.style.padding = "0 30px 0 15px";
  };

  const handleResize = () => {
    const searchElement = document.querySelector(".search") as HTMLElement;
    if (window.innerWidth >= 640) {
      resetSearchElementStyles(searchElement);
    } else if (inputValue) {
      goFull(searchElement);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [inputValue]);

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
      className="search relative w-full"
      ref={resultsRef}
      onSubmit={handleSubmit}
    >
      <div className="sticky top-4 w-full text-lg">
        <input
          type="search"
          placeholder="Type Here"
          className="subpixel-antialiased h-12 w-full outline-none rounded-full bg-slate-200 pl-10 pr-11 text-slate-600"
          onChange={handleInputChange}
          value={inputValue}
        />
        <div
          className="absolute divide-y top-16 bg-black text-white rounded-2xl w-full"
          style={{
            height:
              visible && search.length > 0
                ? `${
                    search.length === 1
                      ? 7
                      : search.length * (window.innerWidth < 550 ? 4.3 : 6.5)
                  }rem`
                : "0",
            transition: "height 0.2s ease-in-out",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {search.map((result, index) => (
            <Link
              key={index}
              href={`/Games/${result.slug}`}
              className="flex flex-row transition-all duration-300 ease-in-out hover:scale-[1.02] pl-6 hover:text-stone-400"
            >
              <div className="relative overflow-hidden sm:w-44 sm:h-32 min-[420px]:w-40 min-[420px]:h-28 w-36 h-24 flex-shrink-0 flex-grow-0">
                <img
                  src={result.background_image}
                  alt={result.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div
                  onClick={() => handleAutoComplete(result.name)}
                  className="search-result pt-3 uppercase font-bold italic cursor-pointer text-[16px] pl-6 pr-4"
                >
                  {result.name}
                </div>
                <div className="pt-3 flex flex-row items-center italic cursor-pointer text-black font-black text-[16px] pl-6 pr-4">
                  <span className="flex gap-[0.9px] text-white rounded-md p-1">
                    {convertToStars(result.rating)}
                  </span>
                </div>
                <div className="py-2 cursor-pointer text-[15px] pl-6 pr-4">
                  Release Date: {result.released}
                </div>
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
