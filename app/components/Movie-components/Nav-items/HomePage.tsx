import Link from 'next/link'
import { BsHouseFill } from "react-icons/bs";

const HomePage = () => {
    return (
        <div className='not-search'>
            <Link className='flex flex-row items-center h-20 gap-2 not-search' href={'/'}>
                <BsHouseFill style={{ margin: "0 1.5rem", flexShrink: 0 }} />
                <span className='opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-2 not-search'>Home</span>
            </Link>
        </div>
    )
}


export default HomePage;