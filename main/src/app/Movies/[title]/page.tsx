import Image from "next/legacy/image";
import { IoMdPerson } from "react-icons/io";

interface MovieData {
  id: number;
  href: string;
  src: string;
  alt: string;
  src2: string;
  alt2: string;
  title: string;
  dec: string;
  names: string;
}

const getMovieDetails = async (title: string) => {
  const res = await fetch("http://localhost:4000/movieData/" + title);

  return res.json();
};

const MovieDetails = async ({ params }: { params: MovieData }) => {
  const movie: MovieData = await getMovieDetails(params.title);

  return (
    <div className="flex flex-col items-center ml-[8rem] mr-[4.809rem] w-10/12 trending-page not-search">
      <div className="sm:w-48 lg:w-64 lg:h-64 p-10 relative contain content-none">
        <Image
          src={movie.src2}
          alt={movie.alt2}
          layout="fill"
          objectFit="cover"
          className="w-full h-full absolute"
          priority
        />
      </div>

      {/* div pou tha krataei ton titlo ths tainias kai to description */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-2xl font-open-sans flex items-center justify-center">
          {movie.title}
        </h2>

        <p className="mt-10 ml-10 text-xl object-contain">{movie.dec}</p>
        {/* flex me tous hthopoious kai to icon */}
        <div className="flex items-center justify-center ml-auto mt-auto gap-4">
          <IoMdPerson />
          <span>{movie.names}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
