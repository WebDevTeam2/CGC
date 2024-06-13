import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { IoReturnUpBack } from "react-icons/io5";
import { FaXbox, FaPlaystation } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
import { SiEpicgames } from "react-icons/si";
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
  return (
    <nav className="w-full flex justify-between px-3 sticky top-0 bg-black h-[10vh] z-10">
      <div className="left-side-elements h-full">
        <Link href="/" className="flex items-center h-full">
          <button className="bg-stone-300 text-4xl text-stone-800 transition delay-50 p-1 rounded-full hover:scale-125">
            <IoReturnUpBack />
          </button>
        </Link>
      </div>
      <div className="right-side-elements h-full">
        <div className="lg:flex h-full text-4xl items-center hidden gap-3">
          {parent_platforms.length > 0 &&
            parent_platforms.map((platform, index) => {
              const logo = logos.find(
                (logo) => logo.slug === platform.platform.slug
              );
              return (
                logo && (
                  <Link
                    href={`/Games/${platform.platform.slug}/page/1`}
                    key={index}
                  >
                    <button className="text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
                      {logo.component}
                    </button>
                  </Link>
                )
              );
            })}
          <Link href={"Games/Signup"}>
            <button className="text-stone-200 transition delay-50 p-2 rounded-full hover:scale-125">
              <IoIosLogIn />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
