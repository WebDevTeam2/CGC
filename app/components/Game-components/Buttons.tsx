import React from "react";
import Link from "next/link";
import {
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
} from "react-icons/ri";
import {
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

const Buttons = () => {
  return (
    <div className="relative text-white mt-5 flex flex-row gap-4 transition-all duration-200">
      <Link href={``}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <MdKeyboardDoubleArrowLeft />
        </button>
      </Link>
      <Link href={``}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <MdKeyboardArrowLeft />
        </button>
      </Link>
      <Link href={`/Games`}>
        <button className="transition-all duration-200 border-2 p-1.5 rounded-md bg-stone-600 border-stone-600 hover:scale-105">
          <RiNumber1 />
        </button>
      </Link>
      <Link href={`/Games/page/[index]`}>
        {/* /Games/${something} */}
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md bg-stone-600 border-stone-600">
          <RiNumber2 />
        </button>
      </Link>
      <Link href={`/Games/page/[index]`}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <RiNumber3 />
        </button>
      </Link>
      <Link href={`/Games/page/[index]`}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <RiNumber4 />
        </button>
      </Link>
      <Link href={`/Games/page/[index]`}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <RiNumber5 />
        </button>
      </Link>
      <Link href={``}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <MdKeyboardArrowRight />
        </button>
      </Link>
      <Link href={``}>
        <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
          <MdKeyboardDoubleArrowRight />
        </button>
      </Link>
    </div>
  );
};

export default Buttons;
