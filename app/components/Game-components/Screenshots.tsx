"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = "?key=f0e283f3b0da46e394e48ae406935d25";

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  // const scrollDown = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollBy({ top: 200, behavior: "smooth" });
  //   }
  // };

  useEffect(() => {
    const fetchScreenshots = async (slug: string) => {
      try {
        const res = await fetch(
          basePosterUrl + slug + "/screenshots" + apiPosterKey
        );
        const data = await res.json();

        // Store only the results array
        setScreenshots(data.results);
      } catch (error) {
        console.error("Error fetching screenshots:", error);
      }
    };
    fetchScreenshots(params.name);
  }, []);

  return (
    <div className="relative w-96 flex items-center flex-col gap-2 pr-12">
      <span className="font-bold text-white text-3xl">Screenshots</span>
      <div className="grid grid-cols-1 h-[72vh] overflow-hidden gap-2 text-balance transition-all duration-200 text-white">
        {screenshots && screenshots.length > 0 ? (
          screenshots.map((item, index) => (
            <Image
              key={index}
              role="button"
              alt={`game_screenshot_${index}`}
              src={item.image}
              width={300}
              height={300}
              className="transition-smooth duration-200 ease-in-out"
            />
          ))
        ) : (
          <span className="text-xl text-white text-center w-64">
            Loading...
          </span>
        )}
        <div className="absolute bottom-24 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      </div>
      <button className="absolute bottom-20 left-26 text-white bg-black bg-opacity-50 text-4xl rounded-full">
        <FaArrowCircleDown />
      </button>
    </div>
  );
};

export default Screenshots;
