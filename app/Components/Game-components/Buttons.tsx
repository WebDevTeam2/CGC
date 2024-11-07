import Link from "next/link";
import { pageSize } from "@/app/Constants/constants";

interface ButtonsProps {
  gamesLength: number;
  link: string;
  page: number;
}

const Buttons = async ({ gamesLength, link, page }: ButtonsProps) => {
  const totalPages = Math.ceil(gamesLength / pageSize);
  let buttons = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Determine the range of page buttons to display
  const getPageRange = () => {
    const totalButtonsToShow = 5;
    if (totalPages <= totalButtonsToShow) {
      return buttons;
    }
    const start = Math.max(1, page - Math.floor(totalButtonsToShow / 2));
    const end = Math.min(totalPages, start + totalButtonsToShow - 1);
    return buttons.slice(start - 1, end);
  };
  const pageRange = getPageRange();

  return (
    <div className="relative text-white my-5 mb-10 flex flex-row items-center justify-center gap-4 max-[450px]:gap-2 transition-all duration-200">
      {page > 3 && (
        <Link href={`${link}/1`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md bg-stone-600 border-stone-600">
            {"<<"}
          </button>
        </Link>
      )}
      {page > 1 && (
        <Link href={`${link}/${Math.max(page - 1, 1)}`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md bg-stone-600 border-stone-600">
            {"<"}
          </button>
        </Link>
      )}
      {pageRange.map((item) => (
        <Link
          href={`${link}/${item}`}
          key={item}
          className={`hover:scale-110 transition-all duration-200 border-none py-1.5 px-3 rounded-md ${
            item === page ? "bg-stone-800" : "bg-stone-600"
          }`}
        >
          {item}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={`${link}/${Math.min(page + 1, totalPages)}`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
            {">"}
          </button>
        </Link>
      )}
      {page < totalPages - 2 && (
        <Link href={`${link}/${totalPages}`}>
          <button className="hover:scale-110 transition-all duration-200 border-2 px-2 py-[0.2rem] rounded-md  bg-stone-600 border-stone-600">
            {">>"}
          </button>
        </Link>
      )}
    </div>
  );
};

export default Buttons;
