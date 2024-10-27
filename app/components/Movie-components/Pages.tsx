import Link from "next/link";
interface PagesProps {
  page: number;
  link: string;
}
const MoviePages = async ({ page, link }: PagesProps) => {
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="flex flex-row mb-2 mt-1 md:ml-12 lg:ml-8 text-center justify-center gap-4 text-lg not-search main-movies-pages">
      <Link
        className="hover:opacity-[0.5] transition duration-200"
        href={`${link}/${page - 1}`}
      >
        {"<"}
      </Link>
      {pages.map((pageNumber) => (
        <div key={pageNumber}>
          <Link
            href={`${link}/${pageNumber}`}
            className={`${
              pageNumber === page
                ? "current-page p-1 text-white rounded-full bg-[#4c545b]"
                : "other"
            } hover:opacity-[0.5] transition duration-200`} //Kanoume target me styles to page pou vrisketai o xrhsrhs
          >
            {pageNumber}
          </Link>
        </div>
      ))}
      <Link
        className="hover:opacity-[0.5] transition duration-200"
        href={`${link}/${page + 1}`}
      >
        {">"}
      </Link>
    </div>
  );
};

export default MoviePages;
