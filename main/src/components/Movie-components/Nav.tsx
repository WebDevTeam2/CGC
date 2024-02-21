import React from 'react';
import Link from 'next/link';
import { BsHouseFill } from "react-icons/bs";

export default function Nav() {
    return (
        <nav className='w-28 h-screen fixed bg-[#23232e] hover:w-56 group duration-700 ease-in-out'>
            <ul className='flex flex-col w-full h-full'>
                <li className='flex flex-row items-center gap-2 w-full text-white'>
                    <Link href={'../../page'}><BsHouseFill /></Link>
                    <span>Home </span>
                </li>
            </ul>
            
        </nav>
    )
}