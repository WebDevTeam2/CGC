"use client";
import Image from "next/image";
import { GrNext, GrPrevious } from "react-icons/gr";
import React, { useEffect, useState } from "react";

const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = "?key=f0e283f3b0da46e394e48ae406935d25";

interface Post {
  page: number;
  results: PostPage[];
}
interface PostPage {
  id: number;
  slug: string;
  name: string;
  next: string;
  previous: string;
  count: number;
  results: [
    {
      id: number;
      image: string;
      width: number;
      height: number;
      is_deleted: boolean;
      name: string;
      preview: string;
      data: {
        480: string;
        max: string;
      };
    }
  ];
}

const Screenshots = ({ params }: { params: PostPage }) => {
  //parsing specifically elements of the results array so that i can say item.image
  const [screenshots, setScreenshots] = useState<PostPage["results"]>();
  const [next, setNext] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchScreenshots = async (slug: string) => {
      try {
        const res = await fetch(
          basePosterUrl + slug + "/screenshots" + apiPosterKey
        );
        const data = await res.json();

        // Store only the results array
        setScreenshots(data.results);
        setNext(data.next);

        setCount(data.results.length);
      } catch (error) {
        console.error("Error fetching screenshots:", error);
      }
    };
    fetchScreenshots(params.name);
  }, []);

  useEffect(() => {
    if (next) console.log("hello");
  }, [next]);

  const handleClick = () => {
    console.log("clicked me");
  };

  return (
    <div className="relative flex flex-col gap-2 pt-12">
      <span className="font-bold text-white text-3xl">
        Screenshots ({count}):
      </span>
      <div className="flex z-10 overflow-x-hidden overflow-x-visible flex-row gap-2 text-balance text-white">
        <div className="arrows z-20 pointer-events-none flex absolute w-full h-[168px] items-center justify-between text-white text-4xl">
          <button
            className="border pointer-events-auto rounded-full p-2 bg-slate-900"
            onClick={handleClick}
          >
            <GrPrevious />
          </button>
          <button className="border pointer-events-auto rounded-full p-2 bg-slate-900">
            <GrNext />
          </button>
        </div>
        {screenshots?.map((item, index) => (
          <Image
            key={index}
            role="button"
            alt={`game_screenshot_${index}`}
            src={item.image}
            width={300}
            height={300}
            className="hover:scale-110 transition-smooth duration-200 ease-in-out"
          />
        ))}
      </div>
    </div>
  );
};

export default Screenshots;
