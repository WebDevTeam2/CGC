"use client"; //because we use UseState
import Link from "next/link";
import React from "react";
import Image from "next/legacy/image";
const senuaImagePath = "/assets/images/senua.jpg";

function Games() {
  // const [isPlaying, setIsPlaying] = useState(false);
  // const videoRef = useRef<HTMLVideoElement>(null);
  // let timer: ReturnType<typeof setTimeout>;

  // // Function to play the video with promise handling
  // const handleMouseEnter = () => {
  //   // Timeout to ensure the hover effect triggers properly
  //   timer = setTimeout(() => {
  //     if (!isPlaying && videoRef.current) {
  //       const playPromise = videoRef.current.play();
  //       if (playPromise !== undefined) {
  //         playPromise
  //           .then(() => {
  //             // Automatic playback started!
  //             setIsPlaying(true);
  //           })
  //           .catch((error) => {
  //             // Auto-play was prevented
  //             console.error("Auto-play was prevented:", error);
  //           });
  //       }
  //     }
  //   }, 400);
  // };

  // // Function to stop the video when not hovered
  // const handleMouseLeave = () => {
  //   clearTimeout(timer);
  //   if (isPlaying && videoRef.current) {
  //     videoRef.current.pause();
  //     setIsPlaying(false);
  //   }
  // };

  return (
    <Link
      href={`/Games/page/1`}
      className="relative group text-6xl justify-center flex lg:w-2/4 w-full h-screen overflow-hidden transition duration-500 ease-in-out cursor-pointer"
    >
      <Image
        src={senuaImagePath}
        alt="Senua image placeholder"
        layout="fill"
        objectFit="cover"
        className="absolute grayscale hover:grayscale-0 transition duration-1000"
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
        <source src="/assets/videos/shock.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </Link>
  );
}

export default Games;
