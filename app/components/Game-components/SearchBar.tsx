"use client";
import { AiOutlineSearch } from "react-icons/ai";
import { useRef, useEffect, useState } from "react";
const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=f0e283f3b0da46e394e48ae406935d25";
const apiPosterUrl = basePosterUrl + "?page_size=10&" + apiPosterKey;

interface Post {
  page: number;
  results: PostResult[];
}
//  onSearch: (postTitle: string) => void;
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

const stripHtmlTags = (html: string) => {
  const regex = /(<([^>]+)>)/gi;
  return html.replace(regex, "");
};

const getGameData = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  // https://api.rawg.io/api/games?key=f0e283f3b0da46e394e48ae406935d25

  //this command iterates over the array of game results fetched from url
  //for each game it creates a promise that fetched additional data about each game like its description
  const gameDetailsPromises = data.results.map(async (game: PostResult) => {
    // const gameRes = await fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`);
    const [gameRes, trailerRes] = await Promise.all([
      fetch(`${basePosterUrl}/${game.id}?${apiPosterKey}`),
      fetch(`${basePosterUrl}/${game.id}/movies?${apiPosterKey}`),
    ]);
    const [gameData, trailerData] = await Promise.all([
      gameRes.json(),
      trailerRes.json(),
    ]);
    //https://api.rawg.io/api/games/3498?key=f0e283f3b0da46e394e48ae406935d25

    // const gameData = await gameRes.json();
    const strippedDescription = stripHtmlTags(gameData.description);
    const trailerUrl =
      trailerData.results.length > 0 ? trailerData.results[0].data.max : null;
    //this return command is used to get the original game details plus its description
    return { ...game, description: strippedDescription, trailerUrl };
  });
  // This ensures that all game details are fetched before proceeding.
  const gameDetails = await Promise.all(gameDetailsPromises);
  // this line returns an object with the original data fetched from (data) with the updated results property, where each game now includes an description.
  return { ...data, results: gameDetails };
};

const SearchBar = () => {
  const [search, setSearch] = useState<PostResult[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to manage input value // State to manage input value
  const [visible, setVisible] = useState(false);
  const resultsRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiPosterUrl);
        const data = await res.json();
        setSearch(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
    let selectedIndex = -1;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && selectedIndex < search.length - 1)
        selectedIndex++;
      else if (e.key === "ArrowUp" && selectedIndex > 0) selectedIndex--;
      if (selectedIndex !== -1) setInputValue(search[selectedIndex].name);
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
        search
          .filter((post) => post.name.toLowerCase().startsWith(lowercaseValue))
          .slice(0, 8)
      );
      console.log(search);
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
              onClick={() => handleAutoComplete(result.name)}
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
