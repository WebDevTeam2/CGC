"use client";
import Link from "next/link";
import Image from "next/legacy/image";
import { useState, useEffect } from "react";
import { getVotecolor, options } from "@/app/constants/constants";

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
    options
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
    <div>
      <h2 className="sm:ml-5 md:ml-[10rem] lg:ml-[20rem] mt-10 text-[18px] font-bold">
        Recommended TV Shows:{" "}
      </h2>
      <div className="recommended-shows grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4 sm:ml-5 md:ml-[10rem] lg:ml-[20rem] h-full not-search">
        {recommendedShows.slice(0, visible).map((item) => (
          <Link
            key={item.id}
            href={`/Movies/TVShows/${item.id}`}
            className="lg:hover:scale-110 w-full transition recommended-link duration-700 ease-in-out mb-6"
          >
            <div className="recommendation-image-container sm:w-full sm:h-56 lg:w-full lg:h-96 p-10 relative">
              <Image
                src={`${imageURL}${item.poster_path}`}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="w-full h-full absolute"
                priority
              />
            </div>
            <div className="bg-[#4c545b] h-44 gap-4 cards">
              <div className="flex ml-4 text-white">
                <h2 className="">{item.name}</h2>
                <span
                  className={`${getVotecolor(
                    item.vote_average
                  )} ml-auto mr-5 mt-11`}
                >
                  {item.vote_average.toString().slice(0, 3)}
                </span>
              </div>
              <p className="mt-4 ml-4 text-white">
                {item.overview.slice(0, 40)}...
              </p>
            </div>
          </Link>
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

export default TVShowsRecommendations;
