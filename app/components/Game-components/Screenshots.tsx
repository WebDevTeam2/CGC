"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "../../Games/style.module.css";
import { Transition } from "@headlessui/react";
const basePosterUrl = process.env.NEXT_PUBLIC_BASE_POSTER_URL;
const apiPosterKey = process.env.NEXT_PUBLIC_API_KEY;

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
  const cache = useRef<{ [key: string]: PostPage["results"] }>({});

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
      if (cache.current[slug]) {
        setScreenshots(cache.current[slug]);
        return;
      }
      try {
        const res = await fetch(
          basePosterUrl + "/" + slug + "/screenshots?" + apiPosterKey
        );
        const data = await res.json();
        cache.current[slug] = data.results;
        setScreenshots(data.results);
      } catch (error) {
        console.error("Error fetching screenshots:", error);
      }
    };

    fetchScreenshots(params.name);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [params.name]);

  useEffect(() => {
    // Prevent scrolling when the modal is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed w-full h-[80rem] lg:-translate-y-4 min-[780px]:-translate-y-[17rem] min-[480px]:-translate-y-[14rem] -translate-y-[38rem]  lg:pt-0 pt-24 bg-black bg-opacity-75 flex justify-center z-30">
          <div
            ref={imageRef}
            className="relative lg:h-[40rem] lg:w-[50rem] min-[800px]:h-[35rem] min-[800px]:w-[40rem] min-[670px]:h-[35rem] min-[670px]:w-[35rem] min-[580px]:h-[35rem] min-[580px]:w-[30rem] min-[480px]:h-[35rem] min-[480px]:w-[25rem] h-[32rem] w-[19rem] transition-all duration-200 text-white"
          >
            {screenshots && screenshots.length > 0 ? (
              screenshots.map((item) => (
                <>
                  <Transition
                    key={item.id} // Unique key based on item.id
                    show={currentIndex === screenshots.indexOf(item)}
                    enter={`transition ease-out duration-300 ${
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
                    leave="transition ease-in duration-300"
                    leaveFrom="transform translate-x-0 visible"
                    leaveTo={`transform ${
                      direction === "next"
                        ? "-translate-x-full"
                        : "translate-x-full"
                    } invisible`}
                  >
                    <Image
                      role="button"
                      alt={`game_screenshot_${item.id}`}
                      src={item.image}
                      fill={true}
                      style={{ objectFit: "contain" }}
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
            <div className="flex w-full min-[480px]:translate-y-[18rem] translate-y-[15.5rem] min-[480px]:text-4xl text-3xl opacity-[.8] px-2 pointer-events-none justify-between">
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
              className="absolute lg:translate-y-16 min-[800px]:translate-y-20  min-[680px]:translate-y-24 min-[580px]:translate-y-28 translate-y-36 rounded-full  px-3 py-0.5 opacity-[.8] bg-black right-2 text-white min-[480px]:text-2xl text-lg transition-all duration-200 hover:bg-slate-300 hover:text-black"
              onClick={handleClose}
            >
              x
            </button>
          </div>
        </div>
      )}
      <div className="relative lg:w-[20vw] w-[90vw] lg:h-[80vh] h-auto lg:-translate-y-4 -translate-y-0 flex items-center flex-col gap-2 lg:pr-12 pr-0 lg:pb-0 pb-20">
        <style jsx>{`
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
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
          className={`flex ${styles.scrollbar} items-center overflow-x-auto lg:overflow-auto w-full lg:flex-col min-[480px]:flex-row flex-col gap-2 text-balance transition-all duration-200 text-white`}
        >
          {screenshots && screenshots.length > 0 ? (
            screenshots.map((item) => (
              <Image
                key={item.id}
                role="button"
                alt={`game_screenshot_${item.id}`}
                src={item.image}
                sizes="(min-width: 1550px) 15rem, (min-width: 1450px) 12rem, (min-width: 1350px) 11rem, (min-width: 1024px) 11rem, (min-width: 650px) 18rem, (min-width: 480px) 13rem, 15rem"
                // Make the image display full width
                width={240}
                height={300}
                className=" transition-smooth  duration-200 ease-in-out"
                onClick={() => handleClick(screenshots.indexOf(item))}
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
