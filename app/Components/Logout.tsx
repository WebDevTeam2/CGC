"use client";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    //after signout redirect to path "/"
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
  );
};

export default Logout;
