"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { options } from "@/app/constants/constants";

const movieSearchUrl = "https://api.themoviedb.org/3/search/movie";
const tvSearchUrl = "https://api.themoviedb.org/3/search/tv";

interface SearchProps {
  setSearchVisible: (visible: boolean) => void;
}

interface Result {
  id: number;
  title?: string; // Oi tainies exoun title
  name?: string; // Oi seires exoun name
  media_type: "movie" | "tv";
  poster_path?: string;
}

//fetch tis tainies, to function epistrefei ena Promise apo Results
const getMovies = async (query: string): Promise<Result[]> => {
  const res = await fetch(`${movieSearchUrl}?query=${query}&api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`, options);
  const data = await res.json();
  //dinw stis tainies ena media_type
  return data.results.map((result: any) => ({
    ...result,
    media_type: "movie",
  }));
};

//fetch tis seires, to function epistrefei ena Promise apo Results
const getTVShows = async (query: string): Promise<Result[]> => {
  const res = await fetch(`${tvSearchUrl}?query=${query}&api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`, options);
  const data = await res.json();
  //dinw stis seires ena media_type
  return data.results.map((result: any) => ({ ...result, media_type: "tv" }));
};

const Search = ({ setSearchVisible }: SearchProps) => {
  const [results, setResults] = useState<Result[]>([]); //Array pou exei mesa kai tainies kai seires
  const [searchTerm, setSearchTerm] = useState<string>(""); //SearchTerm einai to text pou grafei o xrhsths sto input
  const searchRef = useRef<HTMLFormElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1); //Gia na mporei na epileksei o xrhsths kapoio apotelesma apo ta results me ta velakia
  const router = useRouter();

  useEffect(() => {
    //An kanoume click opoudhpote ektos tou form to search den einai pleon visible kai kleinei
    const handler = (e: MouseEvent) => {
      //An to search einai anoixto kai to click ginei ektos twn oroiwn tou tote to search kleinei
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchVisible(false);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [searchRef]); //kathe fora pou allazei to form(searchRef) kaleitai to handler

  //Kathe fora pou allazei to searchTerm kanw fetch apo to API ta apotelesmata pou tairiazoun me to content pou grafei o xrhsths
  useEffect(() => {
    if (searchTerm.trim()) {
      const fetchResults = async () => {
        const movieResults = await getMovies(searchTerm);
        const tvResults = await getTVShows(searchTerm);
        const allResults = [...movieResults, ...tvResults]; //Vazw sto allResults ola ta periexomena apo to fetch

        //Kanw sort ta apotelesmata
        const sortedResults = allResults.sort((a, b) => {
          const query = searchTerm.toLowerCase();
          const aTitle = (a.title || a.name || "").toLowerCase();
          const bTitle = (b.title || b.name || "").toLowerCase();

          //Proteraiothta sta results pou exoun eikona
          if (a.poster_path && !b.poster_path) return -1;
          if (!a.poster_path && b.poster_path) return 1;

          //Proteraiothta sta results pou tairiazoun akrivws me to ti exei grapsei o xrhsths
          if (aTitle === query) return -1;
          if (bTitle === query) return 1;
          //Proteraiothta sta results pou xekinane me to ti exei grapsei o xrhsths
          if (aTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query)) return 1;

          return 0;
        });

        setResults(sortedResults);
        setFocusedIndex(-1); //kanoume reset to focusedIndex otan allazoun ta results
      };

      fetchResults();
    }
    //An to input tou xrhsth einai keno tote kanoume keno kai to results
    else 
      setResults([]);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") 
        setFocusedIndex(focusedIndex + 1);
      else if (e.key === "ArrowUp") 
        setFocusedIndex(focusedIndex - 1);
      else if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        router.push(
          `/${
            results[focusedIndex].media_type === "movie"
              ? "Movies"
              : "Movies/TVShows"
          }/${results[focusedIndex].id}`
        );
        setSearchVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex, results, router, setSearchVisible]);

  //Dinoume timh sto searchTerm na einai to input 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  //Otan patame to enter kanoume submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/Movies/Search/${searchTerm}`); //An ginei submit kanoume redirect ton xrhsth sto dynamiko page gia ta apotelesmata tou search
      setSearchVisible(false); //kai kleinoume to search
    }
    //To fetch kaleitai aytomata kathe fora pou allazei to searchTerm
  };

  return (
    <form
      ref={searchRef}
      className="md:w-[440px] w-[75%] flex flex-col gap-2 absolute top-20 left-1/2 transform z-10 -translate-x-1/2 transition duration-700 ease-in-out"
      onSubmit={handleSubmit}
    >
      <div className="relative flex flex-row">
        <input
          type="search"
          placeholder="Search... (press enter to submit your search)"
          className="w-full rounded-full text-[#d3d3d3] p-4 bg-slate-800 text-start search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* search result container */}
      {results.length > 0 && (
        <div className="flex flex-col bg-slate-800 p-2 rounded-xl text-[#d3d3d3]">
          {
            //only show the first 5 results
            results.slice(0, 5).map((result, index) => (
              <Link
                key={result.id}
                href={`/${
                  result.media_type === "movie" ? "Movies" : "Movies/TVShows" //the path changes based on the media type
                }/${result.id}`}
                onClick={() => setSearchVisible(false)}
                onMouseEnter={() => setFocusedIndex(index)} // Update focusedIndex on hover
                className={`flex flex-row w-full border-gray-700 transition duration-200 hover:bg-[#4c545b] ${
                  focusedIndex === index ? "bg-[#4c545b]" : ""
                }`}
              >
                <div className="w-16 lg:w-16 h-full">
                  {result.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                      className="object-cover w-full h-full"
                      alt={result.title || result.name}                                           
                    />
                  )}
                </div>
                <div className="ml-4 w-1/2">
                  <h2 className="text-lg">{result.title || result.name}</h2>
                </div>
              </Link>
            ))
          }
        </div>
      )}
    </form>
  );
};

export default Search;
