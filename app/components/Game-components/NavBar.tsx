import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { IoReturnUpBack } from "react-icons/io5";
import { FaXbox, FaPlaystation } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames } from "react-icons/si";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="w-full fixed top-0 bg-black h-16 py-9 z-10 ">
      <div className="left-side-elements">
        <Link href="/">
          <button className="absolute z-10 top-3.5 left-4 bg-stone-300 text-3xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-125">
            <IoReturnUpBack />
          </button>
        </Link>
      </div>
      <div className="right-side-elements">
        <div className="lg:block hidden">
          <button className="absolute z-10 top-2.5 right-20 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <FaXbox />
          </button>
          <button className="absolute z-10 top-2.5 right-36 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <FaPlaystation />
          </button>
          <button className="absolute z-10 top-2.5 right-52 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <BsNintendoSwitch />
          </button>
          <button className="absolute z-10 top-2.5 right-[18rem] text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
            <SiEpicgames />
          </button>
        </div>
      </div>
      <Link href={"Games/Signup"}>
        <button className="absolute z-10 top-2.5 right-6 text-3xl text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
          <IoIosLogIn />
        </button>
      </Link>
    </nav>
  );
};

export default NavBar;
