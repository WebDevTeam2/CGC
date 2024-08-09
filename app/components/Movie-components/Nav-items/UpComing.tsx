import { FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";

const UpComing = () => {
    return (
        <div className='not-search'>
            <Link className='flex flex-row items-center h-20 gap-2 not-search' href={'/Movies/Upcoming-Movies/1'}>
                <FaRegCalendarAlt  style={{ margin: "0 1.5rem", flexShrink: 0 }} />
                <span className='sm:block md:block lg:hidden transition duration-700 ease-in-out ml-2 not-search'>Upcoming</span>
            </Link>
        </div>
    )
}

export default UpComing;