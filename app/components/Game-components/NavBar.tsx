"use client";
import React, { useState } from "react";
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
    <nav className="w-full flex justify-between sm:pl-6 pl-4  sticky top-0 bg-black h-[10vh] z-20">
      <div className="left-side-elements h-full">
        <Link href="/" className="flex items-center h-full">
          <button className="bg-stone-300 text-4xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-125">
            <IoReturnUpBack />
          </button>
        </Link>
      </div>
      <div className="right-side-elements h-full">
        <div
          style={{ transitionProperty: "transform" }}
          className={`${
            showmenu
              ? "max-[640px]:translate-x-0"
              : "max-[640px]:translate-x-28"
          }  transition-all duration-300 ease-in-out flex sm:flex-col flex-row items-center mt-3 max-[640px]:absolute max-[640px]:right-0 max-[640px]:top-44`}
        >
          <button
            className="text-white sm:rounded-full sm:p-2 sm:hover:bg-neutral-800 transition delay-75 ease-in-out sm:text-5xl text-xl max-[640px]:bg-neutral-700/50 hover:bg-neutral-900/70 rounded-tl-full rounded-bl-full py-6 px-2"
            onClick={toggleMenu}
          >
            <IoMenu className="sm:block hidden" />
            <FaArrowLeft className="sm:hidden block" />
          </button>

          <ul
            style={{ transitionProperty: "max-height, opacity, transform" }}
            className={`${
              showmenu
                ? "sm:max-h-[30rem] sm:opacity-100"
                : "sm:max-h-0 sm:opacity-0"
            }  bg-black transition-all duration-300 ease-in-out overflow-hidden rounded-lg sm:p-4 p-2 gap-5 flex items-center justify-center flex-col`}
          >
            {logos.map((logo) => (
              <Link key={logo.key} href={`/Games/${logo.slug}/page/1`}>
                <button
                  className="text-stone-200 sm:text-3xl text-2xl transition delay-50 p-2 rounded-full hover:scale-110"
                  onClick={closeDropdown}
                >
                  {logo.component}
                </button>
              </Link>
            ))}
            <Link href={"/Signup"}>
              <button className="text-stone-200 sm:text-xl text-lg uppercase transition delay-50 p-2 rounded-full hover:scale-110">
                Sign Up
              </button>
            </Link>
            <Link href={"/Signin"}>
              <button className="text-stone-200 sm:text-xl text-lg uppercase transition delay-50 p-2 rounded-full hover:scale-110">
                Log In
              </button>
            </Link>
            <Link href={"/Games/page/1"}>
              <button className="text-stone-200 uppercase sm:text-xl text-lg transition delay-50 p-2 rounded-full hover:scale-110">
                All Games
              </button>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
