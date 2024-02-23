"use client";
import React, { ReactNode } from "react";
import { IoIosLogIn } from "react-icons/io";
import { IoReturnUpBack } from "react-icons/io5";
import { FaXbox } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames } from "react-icons/si";
import { Link } from "react-router-dom";

interface NavBarProps {
  children: ReactNode;
}

const NavBar: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <nav className="w-full sticky bg-stone-700">
      <div className="left-side-elements">
        <button className="absolute z-10 top-3.5 left-4 bg-stone-400 text-3xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-125">
          <IoReturnUpBack />
        </button>
      </div>
      <div className="right-side-elements">
        <button className="absolute z-10 top-2.5 right-20 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
          <FaXbox />
        </button>
        <button className="absolute z-10 top-2.5 right-36 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
          <FaPlaystation />
        </button>
        <button className="absolute z-10 top-2.5 right-52 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
          <BsNintendoSwitch />
        </button>
        <button className="absolute z-10 top-2.5 right-72 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
          <SiEpicgames />
        </button>
        <Link
          to={"/Games/Signup"}
          className="relative clip-container group text-6xl justify-center flex w-2/4 h-screen overflow-hidden grayscale hover:grayscale-0 transition duration-500 ease-in-out cursor-pointer"
        >
          <button className="absolute z-10 top-2.5 right-6 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <IoIosLogIn />
          </button>
        </Link>
      </div>
      <div className="nav-content">{children}</div>
    </nav>
  );
};

export default NavBar;
