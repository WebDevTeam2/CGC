
import Link from "next/link";

const changeTabs = () => {
  return (
    <div className="sm:flex-col flex lg:flex-row gap-4 items-center justify-center font-open-sans font-bold text-2xl mb-10 not-search">
      <Link
        href={"/Movies"}
      >
        <button>Movies</button>
      </Link>
      <Link
        href={"/Movies/TVShows"}
      >
        <button>TVShows</button>
      </Link>
    </div>
  );
};

export default changeTabs;
