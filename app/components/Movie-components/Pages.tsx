import Link from "next/link";

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Pages = () => {
  return (
    <div className="flex flex-row ml-20">
        {pages.map((page) => (
            <Link key={page} href={`/Movies/moviePage/${page}`}>{page}</Link>
        ))}
      
    </div>
  );
};

export default Pages;
