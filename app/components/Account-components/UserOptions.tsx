"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const UserOptions = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-[#23232e] mr-8 rounded-l-2xl h-full">
      <ul className="text-[#b6b6b6] divide-y flex flex-col gap-0">
        <li className="cursor-pointer p-4">Account Details</li>
        <li className="cursor-pointer p-4">Games</li>
        <li className="cursor-pointer p-4">Movies</li>
        <li
          className="cursor-pointer p-4"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </li>
      </ul>
    </div>
  );
};

export default UserOptions;
