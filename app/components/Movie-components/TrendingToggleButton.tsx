"use client";
import { useState } from "react";
import { GiFilmProjector } from "react-icons/gi";
import { ImTv } from "react-icons/im";
import Link from "next/link";

const TrendingToggleButton = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div>
      <div className="ml-[20rem] cursor-pointer">
        {isToggled
          ? <ImTv style={{ fontSize: "1.6rem" }} /> && (
              <Link href={"/Movies/TVShows/Trending"}> </Link>
            )
          : <GiFilmProjector style={{ fontSize: "1.6rem" }} /> && (
              <Link href={"/Movies/Movies-trending"}></Link>
            )}
      </div>
    </div>
  );
};

export default TrendingToggleButton;
