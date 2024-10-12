"use client";
import Link from "next/link";
import Image from "next/legacy/image";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import AddToWatchlist from "./AddToWatchlist";

const baseUrl = "https://api.themoviedb.org/3/movie/";
const imageURL = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_BEARER_TOKEN}`,
  },
  next: { revalidate: 43200 },
};
interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

const getVotecolor = (vote: number) => {
  if (vote >= 7) {
    return "text-green-500";
  } else if (vote >= 6) {
    return "text-yellow-500";
  } else {
    return "text-red-500";
  }
};

//Function pou pairnei recommended movies apo to API
const getRecommendedMovies = async (id: string) => {
  const res = await fetch(
    `${baseUrl}${id}/recommendations?include_adult=false&language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`,
    options
  );
  const data = await res.json();
  return data.results;
};

//To component ayto pairnei to id ths tainias san props etsi wste na pairnei kathe fora to id ths kathe tainias xexwrista
const Recommendations = ({ movieId }: { movieId: string }) => {
  const [recommendedMovies, setRecommendedMovies] = useState<
    RecommendedMovie[]
  >([]);
  const [visible, setVisible] = useState(4); //4 tainies einai recommended kathe fora
  const [counter, setCounter] = useState(0); // Metraei to poses fores tha emfanistei to button

  //Pairnoume ta recommendations kai ta vazoume sto reccomendedMovies array
  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendations = await getRecommendedMovies(movieId);
      setRecommendedMovies(recommendations);
    };
    fetchRecommendations();
  }, [movieId]);

  const getMoreRecommendations = () => {
    setVisible((previousIndex) => previousIndex + 4);
  };

  return (
    <div>
      <h2 className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px] font-bold">
        Recommended Movies:{" "}
      </h2>
      <div className="recommended-movies grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full lg:w-3/4 sm:ml-5 md:ml-[10rem] lg:ml-[20rem] h-full not-search">
        {recommendedMovies.slice(0, visible).map((item) => (
          <div
            key={item.id}
            className="lg:hover:scale-110 hover:border hover:shadow-2xl hover:shadow-gray-600 w-full transition recommended-link duration-700 ease-in-out mb-6"
          >
            <Link href={`/Movies/${item.id}`}>
              <div className="recommendation-image-container sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
                <Image
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full absolute"
                  priority
                />
              </div>
            </Link>
            <div className="bg-[#4c545b] flex flex-col h-44 cards rec-text-container">
              {/* title and rating container */}
              <Link
                href={`/Movies/${item.id}`}
                className="flex ml-4 title-raing-container h-10 text-white justify-between"
              >
                <div className="rec-title-container">
                  <h2 className="">{item.title}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`${getVotecolor(item.vote_average)}`}>
                    {item.vote_average.toString().slice(0, 3)}
                  </span>
                  <FaStar color="yellow" />
                </div>
              </Link>
              {/* watchlist and review container */}
              <div className="rec-buttons-container my-auto flex flex-col justify-center gap-4">
                <div className="flex justify-center mt-4 ml-[-2rem]">
                  <AddToWatchlist movieId={item.id} />
                </div>
                <span className="text-white justify-center text-center">
                  Review
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {counter < 4 && (
        <button
          className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] mt-4 bg-[#4c545b] hover:bg-[#3a4045] transition duration-200 text-white font-bold py-2 px-4 rounded rec-button"
          onClick={() => {
            getMoreRecommendations();
            setCounter(counter + 1);
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Recommendations;
