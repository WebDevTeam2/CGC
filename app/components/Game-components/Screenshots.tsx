"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "../../Games/style.module.css";
import { Transition } from "@headlessui/react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isOpen, setIsOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setDirection("next");
    if (screenshots)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
  };
  const previousImage = () => {
    setDirection("prev");
    if (screenshots)
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length
      );
  };

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
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

    // this part is for closing down screenshots when i click outside of its container
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed w-full h-screen -translate-y-4 bg-black bg-opacity-75 flex justify-center z-30">
          <div
            ref={imageRef}
            className="relative h-[70vh] w-[50rem] transition-all duration-200 text-white"
          >
            {screenshots && screenshots.length > 0 ? (
              screenshots.map((item, index) => (
                <>
                  <Transition
                    key={index}
                    show={currentIndex === index}
                    enter={`transition ease-out duration-1000 ${
                      direction === "next"
                        ? "transform translate-x-0 opacity-0"
                        : "transform -translate-x-full opacity-0"
                    }`}
                    enterFrom={`transform ${
                      direction === "next"
                        ? "translate-x-full"
                        : "-translate-x-full"
                    } opacity-0`}
                    enterTo="transform translate-x-0 opacity-100"
                    leave="transition ease-in duration-1000"
                    leaveFrom="transform translate-x-0 visible"
                    leaveTo={`transform ${
                      direction === "next"
                        ? "-translate-x-full"
                        : "translate-x-full"
                    } invisible`}
                  >
                    <Image
                      key={index}
                      role="button"
                      alt={`game_screenshot_${index}`}
                      src={item.image}
                      fill={true}
                      objectFit="contain"
                      className="transition-smooth duration-200 ease-in-out"
                    />
                  </Transition>
                </>
              ))
            ) : (
              <span className="text-xl text-white text-center w-64">
                Loading...
              </span>
            )}
            <div className="flex w-full  translate-y-[32vh] text-4xl opacity-[.8] px-2 pointer-events-none justify-between">
              {screenshots && currentIndex > 0 ? (
                <button
                  className="pointer-events-auto bg-black rounded-full transition-all duration-200 hover:bg-slate-300 hover:text-black"
                  onClick={previousImage}
                >
                  <GrFormPrevious />
                </button>
              ) : (
                <span className="invisible"></span>
              )}
              {screenshots && currentIndex < screenshots.length - 1 ? (
                <button
                  className="pointer-events-auto bg-black rounded-full transition-all duration-200 hover:bg-slate-300 hover:text-black"
                  onClick={nextImage}
                >
                  <GrFormNext />
                </button>
              ) : (
                <span className="invisible"></span>
              )}
            </div>
            <button
              className="absolute translate-y-4 rounded-full top-3 px-3 py-0.5 opacity-[.8] bg-black right-2 text-white text-2xl transition-all duration-200 hover:bg-slate-300 hover:text-black"
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
