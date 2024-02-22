import React from "react";
import Link from "next/link";
import { BsHouseFill } from "react-icons/bs";
import { FaFireAlt } from "react-icons/fa";
import { FaHouse, FaMagnifyingGlass } from "react-icons/fa6";
import { TiArrowShuffle } from "react-icons/ti";

//Ena array apo objects me diaforetiko id gia na mhn epanalamvanetai o kwdikas polles fores
const navItems = [
  {
    id: 1,
    href: "/",
    label: "Home",
    icon: <BsHouseFill style={{margin: "0 1.5rem", flexShrink: 0}}/>,
  },
  {
    id: 2,
    href: "Movies",
    label: "Movies home",
    icon: <FaHouse style={{margin: "0 1.5rem", flexShrink: 0}}/>,
  },
  {
    id: 3,
    href: "Movies-trending",
    label: "Trending",
    icon: <FaFireAlt style={{margin: "0 1.5rem", flexShrink: 0}}/>,
  },
  {
    id: 4,
    href: "#",
    label: "Search",
    icon: <FaMagnifyingGlass style={{margin: "0 1.5rem", flexShrink: 0}}/>,
  },
  {
    id: 5,
    href: "#",
    label: "Random",
    icon: <TiArrowShuffle style={{margin: "0 1.5rem", flexShrink: 0}}/>,
  },
];

export default function Nav() {
  return (
    <nav className="w-20 h-screen fixed bg-[#23232e] hover:w-56 group duration-700 ease-in-out">
      <ul className="flex flex-col items-center p-0 m-0 h-full">
        {/* Map to array gia na pairnoume kathe stoixeio analoga me to id tou */}
        {navItems.map(
          (item) =>
            //me to ?(optional) se peripwtsh pou to item einai keno
            item?.href ? ( //Gia na ginetai render sta sigoura to href mono otan einai defined
              <li
                key={item.id}
                className='text-[#b6b6b6] text-xl w-full hover:bg-[#6B6B6B] transition duration-500 ease-in-out'
              >
                <Link
                  href={item.href}
                  className="flex flex-row items-center h-20 gap-2 "
                >
                  {item.icon}
                  <span className="opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-6">{item.label} </span>
                </Link>
              </li>
            ) : null //An den einai defined einai null
        )}
      </ul>
    </nav>
  );
}
