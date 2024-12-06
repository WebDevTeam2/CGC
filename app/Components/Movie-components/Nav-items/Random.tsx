import { TiArrowShuffle } from "react-icons/ti";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MovieDetails {
  id: number;
}

const Random = () => {
  const [movieData, setMovieData] = useState<MovieDetails[]>([]);
  const [randomId, setRandomId] = useState<number | null>(null);
  const router = useRouter();

  // Fetch movie data on mount
  useEffect(() => {
    const fetchExistingMovieIds = async () => {
      try {
        const response = await fetch("/data/movie_ids_04_24_2024.json");
        const data = await response.text();
        const lines = data.trim().split("\n");
        const movies: MovieDetails[] = lines.map((line: string) => JSON.parse(line));
        setMovieData(movies);
      } catch (error) {
        console.error("Error fetching movie IDs:", error);
      }
    };
    fetchExistingMovieIds();
  }, []);

  // Generate random movie ID
  const getRandomId = () => {
    if (movieData.length > 0) {
      const randomIndex = Math.floor(Math.random() * movieData.length);
      const randomMovie = movieData[randomIndex];
      setRandomId(randomMovie.id);
    }
  };

  // Navigate to random movie when randomId updates
  useEffect(() => {
    if (randomId) {
      router.push(`/Movies/${randomId}`); // Navigate to the random movie page
    }
  }, [randomId, router]);

  return (
    <button
      onClick={getRandomId} // Clicking generates a new randomId
      className="flex flex-row items-center h-20 gap-2 not-search"
    >
      <TiArrowShuffle style={{ margin: "0 1.5rem", flexShrink: 0 }} />
      <span className="sm:block md:block lg:hidden transition duration-700 ease-in-out ml-2 not-search">
        Random
      </span>
    </button>
  );
};

export default Random;
