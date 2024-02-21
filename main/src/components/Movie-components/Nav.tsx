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
    icon: <BsHouseFill />,
  },
  {
    id: 2,
    href: "Movies",
    label: "Movies home",
    icon: <FaHouse />,
  },
  {
    id: 3,
    href: "Movies-trending",
    label: "Trending",
    icon: <FaFireAlt />,
  },
  {
    id: 4,
    href: "#",
    label: "Search",
    icon: <FaMagnifyingGlass />,
  },
  {
    id: 5,
    href: "#",
    label: "Random",
    icon: <TiArrowShuffle />,
  },
];

export default function Nav() {
  return (
    <nav className="w-40 h-screen fixed bg-[#23232e] hover:w-56 group duration-700 ease-in-out">
      <ul className="flex flex-col items-center p-0 m-0 h-full">
        {/* Map to array gia na pairnoume kathe stoixeio analoga me to id tou */}
        {navItems.map(
          (item) =>
            //me to ?(optional) se peripwtsh pou to item einai keno
            item?.href ? ( //Gia na ginetai render sta sigoura to href mono otan einai defined
              <li
                key={item.id}
                className={`text-white text-xl w-full hover:bg-[#13131e] pb-4 pt-4 hover:text-white transition duration-500 ease-in-out ${
                  item.id === 1 ? "mt-6" : "" //Margin mono gia to 1o stoixeio tou nav bar
                }`}
              >
                <Link
                  href={item.href}
                  className="flex flex-row items-center gap-2 "
                >
                  {item.icon}
                  <span>{item.label} </span>
                </Link>
              </li>
            ) : null //An den einai defined einai null
        )}
      </ul>
    </nav>
  );
}
