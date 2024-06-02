"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

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

const FullScreen = ({ params }: { params: PostPage }) => {
  const [screenshots, setScreenshots] = useState<PostPage["results"]>();
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(1);

  const nextImage = () => {
    setStartIndex(startIndex + 1);
    setEndIndex(endIndex + 1);
  };
  const previousImage = () => {
    setStartIndex(startIndex - 1);
    setEndIndex(endIndex - 1);
  };

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
    <div className="fixed w-full h-screen bg-black bg-opacity-75 flex justify-center items-center z-30">
      <div className="relative h-full w-1/2 transition-all duration-200 text-white">
        {screenshots && screenshots.length > 0 ? (
          screenshots
            .slice(startIndex, endIndex)
            .map((item, index) => (
              <Image
                key={index}
                role="button"
                alt={`game_screenshot_${index}`}
                src={item.image}
                fill={true}
                objectFit="contain"
                className="transition-smooth duration-200 ease-in-out"
              />
            ))
        ) : (
          <span className="text-xl text-white text-center w-64">
            Loading...
          </span>
        )}
        <div className="flex w-full translate-y-[50vh] text-4xl opacity-[.8] px-2 pointer-events-none justify-between">
          {screenshots && startIndex > 0 ? (
            <button
              className="pointer-events-auto bg-black rounded-full"
              onClick={previousImage}
            >
              <GrFormPrevious />
            </button>
          ) : (
            <span className="invisible"></span>
          )}
          {screenshots && endIndex < screenshots.length ? (
            <button
              className="pointer-events-auto bg-black rounded-full"
              onClick={nextImage}
            >
              <GrFormNext />
            </button>
          ) : (
            <span className="invisible"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreen;
