"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

const UserOptions = () => {
    const { data: session } = useSession();
    
    return (
        <div className="bg-[#23232e] mr-6 h-full">
        <ul className="text-[#b6b6b6] flex lg:mt-12 flex-col gap-8">
          <li className="mx-[1.5rem] cursor-pointer">Account Details</li>
          <li className="mx-[1.5rem] cursor-pointer">Games</li>
          <li className="mx-[1.5rem] cursor-pointer">Movies</li>
          <li className="mx-[1.5rem] cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</li>
        </ul>
      </div>
    );
}

export default UserOptions;