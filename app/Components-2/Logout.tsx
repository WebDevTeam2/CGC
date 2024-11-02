"use client";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
  );
};

export default Logout;
