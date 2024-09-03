"use client";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <button className="text-stone-200 uppercase sm:text-xl text-lg transition delay-50 p-2 rounded-full hover:scale-110" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
  );
};

export default Logout;
