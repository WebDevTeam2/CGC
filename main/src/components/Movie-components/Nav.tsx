"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BsHouseFill } from "react-icons/bs";
import { FaFireAlt } from "react-icons/fa";
import { FaHouse, FaMagnifyingGlass } from "react-icons/fa6";
import { TiArrowShuffle } from "react-icons/ti";
import Search from "@/components/Movie-components/Search";

//Ena array apo objects me diaforetiko id gia na mhn epanalamvanetai o kwdikas polles fores
const navItems = [
  {
    id: 1,
    href: "/",
    label: "Home",
    icon: <BsHouseFill style={{ margin: "0 1.5rem", flexShrink: 0 }} />,
  },
  {
    id: 2,
    href: "Movies",
    label: "Movies home",
    icon: <FaHouse style={{ margin: "0 1.5rem", flexShrink: 0 }} />,
  },
  {
    id: 3,
    href: "/Movies/Movies-trending",
    label: "Trending",
    icon: <FaFireAlt style={{ margin: "0 1.5rem", flexShrink: 0 }} />,
  },
  {
    id: 4,
    href: "#",
    label: "Search",
    icon: <FaMagnifyingGlass style={{ margin: "0 1.5rem", flexShrink: 0 }} />,
  },
  {
    id: 5,
    href: "#",
    label: "Random",
    icon: <TiArrowShuffle style={{ margin: "0 1.5rem", flexShrink: 0 }} />,
  },
];

export default function Nav() {
  const [searchVisible, setSearchVisible] = useState(false);
  const bodyElement = document.getElementsByTagName('body')[0];

  const toggleSearch = () => {
    setSearchVisible(true);
    bodyElement.classList.add('blurred');
    
  };

  return (
    <div className="nav-for-hover block">
      <nav className="w-20 h-screen fixed bg-[#23232e] hover:w-56 group duration-700 ease-in-out not-search"
      style={{ filter: `blur(${blur}px)` }}>
        <ul className="flex flex-col items-center p-0 m-0 h-full not-search">
          {navItems.map((item) =>
            item?.href ? (
              <li
                key={item.id}
                className="text-[#b6b6b6] text-xl w-full hover:bg-[#6B6B6B] transition duration-500 ease-in-out not-search"
              >
                {/* Gia to koumpi tou search sto navbar*/}
                {/* An to label einai to search tote mesa sto Link pername th leitourgikothta tou search (search component)  */}
                {item.label === "Search" ? (
                  <Link
                    href={item.href}
                    className="flex flex-row items-center h-20 gap-2 not-search"
                    onClick={toggleSearch}
                  >
                    {item.icon}
                    <span className="opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-6 not-search">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  // gia ola ta alla stoixeia sto navbar
                  <Link
                    href={item.href}
                    className="flex flex-row items-center h-20 gap-2 not-search"
                    onClick={() => setSearchVisible(false)}
                  >
                    {item.icon}
                    <span className="opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out ml-6 not-search">
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
            ) : null
          )}
        </ul>
      </nav>

      {searchVisible && <Search />}
    </div>
  );
}
