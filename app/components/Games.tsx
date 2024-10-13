"use client"; //because we use UseState
import Link from "next/link";
import React, { useRef, useState } from "react";
import Image from "next/legacy/image";
import NextVideo from "next-video";
import shock from "@/videos/shock.mp4";

const senuaImagePath = "/assets/images/senua.jpg";

function Games() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  let timer: ReturnType<typeof setTimeout>;

  // Function to play the video with promise handling
  const handleMouseEnter = () => {
    // Timeout to ensure the hover effect triggers properly
    timer = setTimeout(() => {
      if (!isPlaying && videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Automatic playback started!
              setIsPlaying(true);
            })
            .catch((error) => {
              // Auto-play was prevented
              console.error("Auto-play was prevented:", error);
            });
        }
      }
    }, 400);
  };

  // Function to stop the video when not hovered
  const handleMouseLeave = () => {
    clearTimeout(timer);
    if (isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Event handler for video errors
  const handleVideoError = (
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const error = event.currentTarget.error; // Get the error object from the video element
    console.error("Video Error: ", {
      code: error?.code, // Check if error exists
      message: error?.message,
    });
  };

  return (
    <Link
      href={`/Games/page/1`}
      className="relative clip-container group text-6xl justify-center flex lg:w-2/4 w-full h-screen lg:hover:scale-100 hover:scale-105 overflow-hidden transition duration-500 ease-in-out cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={senuaImagePath}
        alt="Senua image placeholder"
        layout="fill"
        objectFit="cover"
        className="absolute lg:hover:opacity-0 transition duration-1000"
        priority
      />
      <h1 className="group-hover:opacity-100 transition duration-1000 flex absolute top-2/4 text-white z-10 lg:text-[4rem] text-[2rem] lg:opacity-0">
        Games
      </h1>
      {/* <video
        className="w-full h-screen absolute object-cover -z-10"
        controls={false}
        ref={videoRef}
        muted
        loop
        onError={handleVideoError} // Add the typed error handler
      >
        <source src="/assets/videos/Sequence4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <NextVideo
        className="w-full h-screen absolute object-cover -z-10"
        src={shock}
        controls={false}
        ref={videoRef}
        muted
        loop
      />
    </Link>
  );
}

export default Games;
