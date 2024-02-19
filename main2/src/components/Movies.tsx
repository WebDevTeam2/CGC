"use client"; //because we use UseState
import NextVideo from "next-video";
import React, { useState, useRef } from "react";

const Movies = () => {
  const [isPlaying, setisPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  let timer: ReturnType<typeof setTimeout>;

  //function gia na paizoun ta video mono otan ginontai hovered
  const handleMouseEnter = () => {
    //timeout gia na eimaste sigouroi oti to hover tha ginei swsta
    timer = setTimeout(() => {
      if (!isPlaying && videoRef.current) {
        //Xekinaei to video na paizei kai kanoume update to state se true
        videoRef.current.play();
        setisPlaying(true);
      }
    }, 400);
  };

  //function gia na stamatane ta video na paizoun otan den einai hovered
  const handleMouseLeave = () => {
    clearTimeout(timer);
    if (isPlaying && videoRef.current) {
      //Stamataei to video kai kanoume update to state se false
      videoRef.current.pause();
      setisPlaying(false);
    }
  };

  return (
    <div
      className="clip-container group text-6xl justify-center flex w-2/4 h-screen overflow-hidden grayscale hover:grayscale-0 transition duration-500 ease-in-out cursor-pointer relative"
      //Efarmozoume ta effects gia na paizoun ta video se oloklkhro to div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h1 className="clip-text hover:opacity-100 transition duration-700 ease-in-out flex absolute top-2/4 text-white z-10">
        Movies
      </h1>

      <NextVideo
        className="w-full h-screen absolute "
        src="/Sequence5.mp4"
        controls={false}
        ref={videoRef}
        muted
      />
    </div>
  );
};
export default Movies;
