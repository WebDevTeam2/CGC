"use client"; // Enable client-side behavior for redirect

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verified() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasToken, setHasToken] = useState<boolean>(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      console.error("User not found");
      return;
    }
    setHasToken(true);
    // Delay navigation to the login page
    const timeoutId = setTimeout(() => {
      router.push("/Signin");
    }, 3000); // 3000 milliseconds = 3 seconds

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [router, token]);
  return (
    <>
      <div className="flex w-full h-screen bg-slate-950 items-center justify-center">
        {hasToken ? (
          <button
            type="button"
            className="pointer-events-none inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 disabled:opacity-70 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            disabled
          >
            <div
              className="inline-block mr-4 h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.4em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            ></div>
            <span className="text-xl">Redirecting you to Sign-In...</span>
          </button>
        ) : (
          <div>
            <span className="text-2xl uppercase bg-transparent text-slate-400">
              Failed to connect
            </span>
          </div>
        )}
      </div>
    </>
  );
}
