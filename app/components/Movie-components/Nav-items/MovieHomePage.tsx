import Link from 'next/link'
import { GiFilmProjector } from "react-icons/gi";

const MovieHomePage = () => {
    return (
        <div className='not-search'>
            <Link className='flex flex-row items-center h-20 gap-2 not-search' href={'/Movies/moviePage/1'}>
                <GiFilmProjector style={{ margin: "0 1.5rem", flexShrink: 0, width: "1.3rem", height: "1.3rem" }} />
                <span className='opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-2 not-search'>Movies</span>
            </Link>
        </div>
    )
}


export default MovieHomePage;