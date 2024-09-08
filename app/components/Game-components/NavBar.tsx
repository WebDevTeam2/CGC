"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoReturnUpBack, IoMenu } from "react-icons/io5";
import { FaXbox, FaPlaystation, FaArrowLeft } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames } from "react-icons/si";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Logout from "../Logout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import defaultAvatar from "@/public/assets/images/default_avatar.jpg";

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
  const [showProfile, setShowProfile] = useState(false);
  const { data: session, status } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  //check if clicked outside of input container
  useEffect(() => {
    const mouseHandler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setTimeout(() => {
          setShowProfile(false);
          setShowMenu(false);
        }, 50);
      }
    };
    document.addEventListener("mousedown", mouseHandler);
    return () => {
      document.removeEventListener("mousedown", mouseHandler);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showmenu);
  };
  const closeDropdown = () => {
    setShowMenu(false);
  };
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  const closeProfile = () => {
    setShowProfile(false);
  };
  console.log(showProfile);
  return (
    <nav className="w-full flex justify-between items-center sm:pl-6 pl-4  sticky top-0 bg-black h-[10vh] z-20">
      <div className="left-side-elements overflow-hidden h-full flex-1 pointer-events-none">
        <Link href="/" className="flex items-center h-full">
          <button className="bg-stone-300 pointer-events-auto text-4xl text-stone-800 transition delay-50 p-1 rounded-full hover:brightness-50">
            <IoReturnUpBack />
          </button>
        </Link>
      </div>
      {session && (
        <div
          className="relative pointer-events-none z-10 group text-white flex flex-col "
          ref={profileRef}
        >
          <div
            className="pointer-events-auto flex flex-row items-center justify-center gap-1 hover:cursor-pointer hover:brightness-75 w-auto h-auto"
            onClick={toggleProfile}
          >
            <Image
              src={session.user?.image || defaultAvatar}
              alt="image"
              height={120}
              width={45}
              className="rounded-full"
            ></Image>
            <IoIosArrowDown className="text-white text-2xl" />
          </div>
          <div
            ref={profileRef}
            className={`pointer-events-auto absolute flex flex-col overflow-hidden right-0 top-14 w-24 bg-white rounded-md shadow-lg transition-all duration-200 ${
              showProfile ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ transitionProperty: "max-height, opacity" }}
            onClick={closeProfile}
          >
            <ul className="py-2 divide-y text-black">
              <Link href={"/account/info"}>
                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li>
              </Link>
              <li className="px-3 text-md py-4 hover:bg-gray-100 cursor-pointer">
                <Logout />
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="right-side-elements h-full">
        <div
          ref={menuRef}
          style={{ transitionProperty: "transform" }}
          className={`${
            showmenu
              ? "max-[640px]:translate-x-0"
              : "max-[640px]:translate-x-28"
          } w-36 transition-all duration-300 ease-in-out flex sm:flex-col flex-row items-center mt-3 max-[640px]:absolute max-[640px]:right-0 max-[640px]:top-44`}
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
            {!session ? (
              <>
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
              </>
            ) : (
              <Logout />
            )}
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
