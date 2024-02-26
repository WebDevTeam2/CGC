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

  const toggleSearch = () => {
    setSearchVisible(true); //An kanoume click to search tote to searchbar ginetai visible
  };

  //Xrhsh useEffect epeidh h react xrhsimpoioei asyncronus updates, an to blur mpei sto toggleSearch kanei to searchVisivle na einai true kai vazei to onoma ths klasshs, alla den prolavainei na kanei render ta styles kai xreiazetai kai 2o click
  useEffect(() => {
    const blur = document.querySelectorAll(".not-search");
    const navForHover = document.querySelector(".nav-for-hover");
    const dummy = document.querySelector(".dummy-class");

    if (searchVisible) {
      navForHover ? navForHover.classList.remove("nav-for-hover") : null; //An exei epilexthei to search aferw to class pou kanw target sto CSS gia ta hover effects

      blur.forEach((e) => {
        //Dialegoume ola ta klasses me to onoma not-search kai ta dinoume mia kainourgia classh pou thn kanoume target me CSS
        e.classList.add("blurred");
        e.classList.add("pointer-events-none"); //Otan ginetai click gia to search theloume na mporei o xxrhsths na kanei target mono ayto
      });
    }
    //Otan den einai epilegmeno to search ta epanaferoume sto arxiko
    else {
      blur.forEach((e) => {
        e.classList.remove("blurred");
        e.classList.remove("pointer-events-none");
      });

      if (dummy) {
        dummy.classList.add("nav-for-hover");
        
      }
    }
  }, [searchVisible]);

  return (
    // Ena wrapper div etsi wste to searchbar na mhn einai mesa sto navbar
    <div className="nav-for-hover dummy-class">
      <nav className="w-20 h-full fixed bg-[#23232e] hover:w-56 group duration-700 ease-in-out not-search">
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

      {/* ektos tou nav giati alliws to search bar emfanizetai dipla apo to li pou einai to search kai oxi sth mesh ths selidas */}
      {searchVisible && <Search setSearchVisible={setSearchVisible} />}
    </div>
  );
}
