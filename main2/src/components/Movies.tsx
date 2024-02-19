"use client"; //because we use UseState
import NextVideo from "next-video";
//import advTime from "../../videos/AdventureTimeopening.mp4"
import React, { useState, useRef } from "react";

const Movies = () => {
  const [isPlaying, setisPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  let timer: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    timer = setTimeout(() => {
      if (!isPlaying && videoRef.current) {
        videoRef.current.play();
        setisPlaying(true);
      }
    }, 400);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    if (isPlaying && videoRef.current) {
      videoRef.current.pause();
      setisPlaying(false);
    }
  };

  return (
    <div
      className="group text-6xl justify-center flex w-2/4  overflow-hidden grayscale hover:grayscale-0 transition duration-500 ease-in-out cursor-pointer "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h1 className="flex absolute top-2/4 text-white z-10 opacity-0">
        Movies
      </h1>
      <NextVideo
        src="/AdventureTimeopening.mp4"
        controls={false}
        ref={videoRef}
        muted
        // className="scale-150"
      />

      
    </div>
  );
};
export default Movies;
