"use client";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <button className="text-2xl bg-blue-500 mt-8 p-4 text-white rounded-full" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
  );
};

export default Logout;
