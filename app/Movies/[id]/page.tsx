import Image from "next/legacy/image";
const apiKey = "api_key=a48ad289c60fd0bb3fc9cc3663937d7b";
const baseUrl = "https://api.themoviedb.org/3/movie/";
const imageURL = "https://image.tmdb.org/t/p/w500";

interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const getMovieDetails = async(id: string) => {
  const res = await fetch(`${baseUrl}${id}?${apiKey}`);
  return res.json();  
}

const MovieDetails = async ({ params }: { params: MovieDetails }) => {

  const movie: MovieDetails = await getMovieDetails(params.id.toString());

  return (
    <div className="flex flex-col items-center ml-[8rem] mr-[4.809rem] w-10/12 not-search">
      <div className="sm:w-48 lg:w-64 lg:h-64 p-10 relative contain content-none">
        <Image
          src={`${imageURL}${movie.poster_path}`}
          alt={movie.title}
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

        <p className="mt-10 ml-10 text-xl object-contain">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetails;
