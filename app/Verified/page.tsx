"use client"; // Enable client-side behavior for redirect

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Verified() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Home page after 3 seconds
    const timeoutId = setTimeout(() => {
      router.push("/Signin");
    }, 3000);

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [router]);
  return (
    <>
      <div className="flex w-full h-screen items-center justify-center">
        <span className="text-lg rounded-xl p-6 w-72 items-center bg-neutral-300 text-black">
          Email was verified. Navigating you to Sign-in...
        </span>
      </div>
    </>
  );
}
