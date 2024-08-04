"use client";
import React, { useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import { IoReturnUpBack } from "react-icons/io5";
import { FaXbox, FaPlaystation } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames } from "react-icons/si";
import { IoMenu } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

const logos = [
  { component: <FaXbox />, key: 3, slug: "xbox" },
  { component: <FaPlaystation />, key: 2, slug: "playstation" },
  { component: <BsNintendoSwitch />, key: 7, slug: "nintendo" },
  { component: <SiEpicgames />, key: 1, slug: "pc" },
];

const NavBar = ({ parent_platforms }: { parent_platforms: Platform[] }) => {
  const [showmenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showmenu);
  };
  const closeDropdown = () => {
    setShowMenu(false);
  };
  console.log(showmenu);
  return (
    <nav className="w-full flex justify-between sm:pl-6 pl-4 sticky top-0 bg-black h-[10vh] z-10">
      <div className="left-side-elements h-full">
        <Link href="/" className="flex items-center h-full">
          <button className="bg-stone-300 text-4xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-125">
            <IoReturnUpBack />
          </button>
        </Link>
      </div>
      <div className="right-side-elements h-full">
        <div className="lg:flex h-full text-4xl items-center hidden gap-3">
          {logos.map((logo) => (
            <Link key={logo.key} href={`/Games/${logo.slug}/page/1`}>
              <button className="text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
                {logo.component}
              </button>
            </Link>
          ))}
          <Link href={"Games/Signup"}>
            <button className="text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
              <IoIosLogIn />
            </button>
          </Link>
        </div>
        <div
          style={{ transitionProperty: "transform" }}
          className={`${
            showmenu
              ? "max-[640px]:translate-x-0"
              : "max-[640px]:translate-x-20"
          } lg:hidden transition-all duration-300 ease-in-out flex sm:flex-col flex-row items-center mt-4 max-[640px]:absolute max-[640px]:right-0 max-[640px]:top-52`}
        >
          <button
            className="text-white sm:rounded-full sm:p-2 sm:hover:bg-neutral-800 transition delay-75 ease-in-out sm:text-4xl text-xl max-[640px]:bg-neutral-100/40 hover:bg-neutral-700/50 rounded-tl-full rounded-bl-full py-6 px-2"
            onClick={toggleMenu}
          >
            <IoMenu className="sm:block hidden" />
            <FaArrowLeft className="sm:hidden block" />
          </button>

          <ul
            style={{ transitionProperty: "max-height, opacity, transform" }}
            className={`${
              showmenu
                ? "sm:max-h-96 sm:opacity-100"
                : "sm:max-h-0 sm:opacity-0"
            }  bg-black transition-all duration-300 ease-in-out overflow-hidden rounded-lg p-4 gap-5 flex items-center justify-center flex-col`}
          >
            {logos.map((logo) => (
              <Link key={logo.key} href={`/Games/${logo.slug}/page/1`}>
                <button
                  className="text-stone-200 text-3xl transition delay-50 p-2 rounded-full hover:scale-125"
                  onClick={closeDropdown}
                >
                  {logo.component}
                </button>
              </Link>
            ))}
            <Link href={"Games/Signup"}>
              <button className="text-stone-200 text-3xl transition delay-50 p-2 rounded-full hover:scale-125">
                <IoIosLogIn />
              </button>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
