import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

const Logout = () => {
    return (
        <div className='not-search'>
            <div onClick={() => signOut({ callbackUrl: "/" })} className='flex cursor-pointer flex-row items-center h-20 gap-2 not-search'>
                <FiLogOut style={{ margin: "0 1.5rem", flexShrink: 0, fontSize: "1.3rem" }} />
                <span className='logout sm:block md:block lg:hidden transition duration-700 ease-in-out ml-2 not-search' >Sign out</span>
            </div>
        </div>
    )
}

export default Logout;