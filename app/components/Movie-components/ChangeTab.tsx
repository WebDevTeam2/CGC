"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const changeTabs = () => {
  const [displayText, setDisplayText] = useState(
    "TOP 10 MOVIES ACCORDING TO NETFLIX"
  );

  return (
    <div className="sm:flex-col flex lg:flex-row gap-4 items-center justify-center font-open-sans font-bold text-2xl mb-10 not-search">
      <Link
        href={"/Movies"}
        onClick={() => setDisplayText("TOP 10 MOVIES ACCORDING TO NETFLIX")}
      >
        <button>Movies</button>
      </Link>
      <Link
        href={"/Movies/TVShows"}
        onClick={() => setDisplayText("TOP 10 TV SHOWS ACCORDING TO NETFLIX")}
      >
        <button>TVShows</button>
      </Link>
      <h1>{displayText}</h1>
    </div>
  );
};

export default changeTabs;
