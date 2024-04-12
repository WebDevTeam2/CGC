import Link from "next/link";
import { TiArrowShuffle } from "react-icons/ti";
import { useState } from "react";

const getRandomMovie = () => {
  const randomId = Math.floor(Math.random() * 1000000);

  return randomId;
};

const Random = () => {
  const [randomId, setRandomId] = useState(getRandomMovie());
  const handleClick = () => {
    setRandomId(getRandomMovie());
  };

  return (  
    <div>
      <Link
      onClick={handleClick}
        className="flex flex-row items-center h-20 gap-2 not-search"
        href={`/Movies/${randomId}`}
      >
        <TiArrowShuffle style={{ margin: "0 1.5rem", flexShrink: 0 }} />
        <span className="opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-6 not-search">
          Random
        </span>
      </Link>
    </div>
  );
};

export default Random;
