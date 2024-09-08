"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const UserOptions = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-[#23232e] mr-8 rounded-l-2xl h-full">
      <ul className="text-[#b6b6b6] pt-2 divide-y flex flex-col gap-0">
        <Link href={"/account/info"}>
          <li className="cursor-pointer transition-all duration-200 hover:text-white p-4">
            Account Details
          </li>
        </Link>
        <Link href={"/account/games"}>
          <li className="cursor-pointer transition-all duration-200 hover:text-white p-4">
            Games
          </li>
        </Link>
        <Link href={"/account/movies"}>
          <li className="cursor-pointer transition-all duration-200 hover:text-white p-4">
            Movies
          </li>
        </Link>
        <li
          className="cursor-pointer transition-all duration-200 hover:text-white p-4"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </li>
      </ul>
    </div>
  );
};

export default UserOptions;
