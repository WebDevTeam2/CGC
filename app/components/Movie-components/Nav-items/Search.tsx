"use client";
import React, { useEffect, useState, useRef, use } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import

const apiKey = "a48ad289c60fd0bb3fc9cc3663937d7b";
const movieSearchUrl = "https://api.themoviedb.org/3/search/movie";
const tvSearchUrl = "https://api.themoviedb.org/3/search/tv";

interface SearchProps {
  setSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Result {
  id: number;
  title?: string; // Movies have 'title'
  name?: string; // TV shows have 'name'
  media_type: "movie" | "tv";
  poster_path?: string;
}

const getMovies = async (query: string): Promise<Result[]> => {
  const res = await fetch(`${movieSearchUrl}?query=${query}&api_key=${apiKey}`);
  const data = await res.json();
  return data.results.map((result: any) => ({
    ...result,
    media_type: "movie",
  }));
};

const getTVShows = async (query: string): Promise<Result[]> => {
  const res = await fetch(`${tvSearchUrl}?query=${query}&api_key=${apiKey}`);
  const data = await res.json();
  return data.results.map((result: any) => ({ ...result, media_type: "tv" }));
};

const Search: React.FC<SearchProps> = ({ setSearchVisible }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchRef = useRef<HTMLFormElement>(null);
  const [submitContent, setSubmitContent] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchVisible(false);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [searchRef, setSearchVisible]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const fetchResults = async () => {
        const movieResults = await getMovies(searchTerm);
        const tvResults = await getTVShows(searchTerm);
        const allResults = [...movieResults, ...tvResults];

        const sortedResults = allResults.sort((a, b) => {
          const query = searchTerm.toLowerCase();
          const aTitle = (a.title || a.name || "").toLowerCase();
          const bTitle = (b.title || b.name || "").toLowerCase();

          if (a.poster_path && !b.poster_path) return -1;
          if (!a.poster_path && b.poster_path) return 1;

          if (aTitle === query) return -1;
          if (bTitle === query) return 1;
          if (aTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query)) return 1;
          return 0;
        });

        setResults(sortedResults);
      };

      fetchResults();
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/Movies/Search/${searchTerm}`);
      setSubmitContent(searchTerm);
      setSearchVisible(false);
    }
    // The fetchMovies function is already handled by useEffect when searchTerm changes
  };

  return (
    <form
      ref={searchRef}
      className="w-[440px] flex flex-col gap-2 absolute top-20 left-1/2 transform z-10 -translate-x-1/2 transition duration-700 ease-in-out searchbar"
      onSubmit={handleSubmit}
    >
      <div className="relative flex flex-row">
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-full text-[#d3d3d3] p-4 bg-slate-800 search"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {results.length > 0 && (
        <div className="w-full flex flex-col bg-slate-800 p-4 rounded-xl text-[#d3d3d3] mt-4">
          {results.slice(0, 6).map((result) => (
            <Link
              key={result.id}
              href={`/${
                result.media_type === "movie" ? "Movies" : "Movies/TVShows"
              }/${result.id}`}
              onClick={() => setSearchVisible(false)}
              className="p-1 flex flex-row border-gray-700 transition duration-200 hover:bg-[#4c545b]"
            >
              <div className="mr-4">
                {result.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                    alt={result.title || result.name}
                    width={64}
                    height={96}
                    objectFit="cover"
                  />
                )}
              </div>
              <div>
                <h2 className="text-lg">{result.title || result.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
};

export default Search;
