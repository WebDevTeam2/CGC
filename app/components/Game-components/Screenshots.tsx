"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "../../Games/style.module.css";

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
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const nextImage = () => {
    setStartIndex(startIndex + 1);
    setEndIndex(endIndex + 1);
  };
  const previousImage = () => {
    setStartIndex(startIndex - 1);
    setEndIndex(endIndex - 1);
  };

  const handleClick = (index: number) => {
    setStartIndex(index);
    setEndIndex(index + 1);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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
    <>
      {isOpen && (
        <div
          className="fixed w-full h-screen -translate-y-4 bg-black bg-opacity-75 flex justify-center z-30"
          onClick={handleClose}
        >
          <div className="relative h-[70vh] w-[50rem] transition-all duration-200 text-white">
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
            <div className="flex w-full translate-y-[32vh] text-4xl opacity-[.8] px-2 pointer-events-none justify-between">
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
            <button
              className="absolute translate-y-4 rounded-full top-3 px-3 py-1 opacity-[.8] bg-black right-2 text-white text-xl"
              onClick={handleClose}
            >
              x
            </button>
          </div>
        </div>
      )}
      <div className="relative w-[30vw] h-[80vh] -translate-y-4 flex items-center flex-col gap-2 pr-12">
        <style jsx>{`
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        <span className="font-bold text-white text-3xl pb-2">Screenshots</span>
        <div
          className={`grid ${styles.scrollbar} overflow-y-auto grid-cols-1 gap-2 text-balance transition-all duration-200 text-white`}
        >
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
                onClick={() => handleClick(index)}
              />
            ))
          ) : (
            <span className="text-xl text-white text-center w-64">
              Loading...
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Screenshots;
