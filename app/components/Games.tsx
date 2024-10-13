"use client"; //because we use UseState
import Link from "next/link";
import React, { useRef, useState } from "react";
import Image from "next/legacy/image";

const senuaImagePath = "/assets/images/senua.jpg";

function Games() {
  const [isPlaying, setisPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); //to videoRef Kanei anafora se HTML video
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
    <Link
      href={`/Games/page/1`}
      className="relative clip-container group text-6xl justify-center flex lg:w-2/4 w-full h-screen lg:hover:scale-100  hover:scale-105 overflow-hidden transition duration-500 ease-in-out cursor-pointer"
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
      ></Image>
      <h1 className="group-hover:opacity-100 transition duration-1000 flex absolute top-2/4 text-white z-10 lg:text-[4rem] text-[2rem] lg:opacity-0">
        Games
      </h1>
       <video
        className="w-full h-screen absolute object-cover -z-10"
        controls={false}
        ref={videoRef}
        muted
        loop
        onError={() => console.error("Error loading video")}
      >
        <source src="/assets/videos/Sequence4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Link>
  );
}

export default Games;
