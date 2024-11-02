import Link from "next/link";
import { BsHouseFill } from "react-icons/bs";

const HomePage = () => {
  return (
    <div className="not-search">
      <Link
        className="flex flex-row items-center h-20 gap-2 not-search logo-container"
        href={"/"}
      >
        <span className="text-3xl font-black italic pointer-events-auto font-sans">
          CGC
        </span>
      </Link>
    </div>
  );
};

export default HomePage;
