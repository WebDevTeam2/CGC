import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { IoReturnUpBack } from "react-icons/io5";
import { FaXbox, FaPlaystation } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames } from "react-icons/si";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="w-full flex justify-between sticky top-0 bg-black h-[8vh] z-10">
      <div className="left-side-elements h-full">
        <Link href="/" className="flex items-center h-full">
          <button className="bg-stone-300 text-3xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-125">
            <IoReturnUpBack />
          </button>
        </Link>
      </div>
      <div className="right-side-elements h-full">
        <div className="lg:flex h-full justify-end items-center hidden gap-3">
          <button className="text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <FaXbox />
          </button>
          <button className="text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <FaPlaystation />
          </button>
          <button className="text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <BsNintendoSwitch />
          </button>
          <button className="text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <SiEpicgames />
          </button>
          <Link href={"Games/Signup"}>
            <button className="text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
              <IoIosLogIn />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
