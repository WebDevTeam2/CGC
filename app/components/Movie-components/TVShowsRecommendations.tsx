"use client";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { clientOptions, getVotecolor } from "@/app/constants/constants";
import AddToWatchlist from "./AddToWatchlist";

const baseUrl = "https://api.themoviedb.org/3/tv/";
const imageURL = "https://image.tmdb.org/t/p/w500";

interface RecommendedShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

//Function pou pairnei recommended tv shows apo to API
const getRecommendedShows = async (id: string) => {
  const res = await fetch(
    `${baseUrl}${id}/recommendations?include_adult=false&language=en-US&page=1&${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`,
    clientOptions
  );
  const data = await res.json();
  return data.results;
};

//To component ayto pairnei to id ths tainias san props etsi wste na pairnei kathe fora to id ths kathe tainias xexwrista
const TVShowsRecommendations = ({ tvShowID }: { tvShowID: string }) => {
  const [recommendedShows, setRecommendedShows] = useState<RecommendedShow[]>(
    []
  );
  const [visible, setVisible] = useState(4); //4 tainies einai recommended kathe fora
  const [counter, setCounter] = useState(0); // Metraei to poses fores tha emfanistei to button

  //Pairnoume ta recommendations kai ta vazoume sto reccomendedMovies array
  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendations = await getRecommendedShows(tvShowID);
      setRecommendedShows(recommendations);
    };
    fetchRecommendations();
  }, [tvShowID]);

  const getMoreRecommendations = () => {
    setVisible((previousIndex) => previousIndex + 4);
  };

  return (
    <div className="overflow-hidden">
      <h2 className="md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px] font-bold">
        Recommended TV Shows:{" "}
      </h2>
      <div className="recommended-shows grid msm:grid-cols-2 msm:gap-3 msm:mx-auto md:grid-cols-3 lg:grid-cols-4 md:gap-4 msm:w-[26rem] md:w-3/4 lg:w-3/4 md:mr-auto md:ml-[10rem] lg:ml-[20rem] h-full not-search">
        {recommendedShows.slice(0, visible).map((item) => (
          <div
            key={item.id}
            className="lg:hover:scale-110 md:hover:border md:hover:shadow-2xl md:hover:shadow-gray-600 lg:hover:border lg:hover:shadow-2xl lg:hover:shadow-gray-600 w-full transition duration-500 ease-in-out"
          >
            <Link href={`/Movies/TVShows/${item.id}`}>
              <div className="msm:w-full msm:h-56 md:w-full md:h-56 lg:w-full lg:h-96 relative">
                <img
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.name}
                  className="w-full object-cover h-full absolute"
                />
              </div>
            </Link>
            <div className="bg-[#4c545b] flex flex-col h-44 cards rec-text-container">
              {/* title and rating container */}
              <Link
                href={`/Movies/TVShows/${item.id}`}
                className="flex lg:ml-4 h-10 text-white justify-between"
              >
                <div className="msm:w-[55%]">
                  <h2 className="">{item.name}</h2>
                </div>
                <div className="flex gap-2">
                  <span className={`${getVotecolor(item.vote_average)}`}>
                    {item.vote_average.toString().slice(0, 3)}
                  </span>
                  <FaStar color="yellow" style={{ marginTop: "3px" }} />
                </div>
              </Link>
              {/* watchlist and review container */}
              <div className="msm:mt-2 md:mt-6 flex flex-col justify-center gap-4">
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
          className="md:ml-[10rem] lg:ml-[20rem] mt-4 bg-[#4c545b] hover:bg-[#3a4045] transition duration-200 text-white font-bold py-2 px-4 rounded rec-button"
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

export default TVShowsRecommendations;
