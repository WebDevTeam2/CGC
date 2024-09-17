"use client"; // Enable client-side behavior for redirect

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Verified() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const password = searchParams.get("password");

  useEffect(() => {
    // Automatically sign in the user after email verification
    async function autoSignIn() {
      const res = await signIn("credentials", {
        redirect: false, // Prevent redirect since we'll handle it
        email: email,
        password: password,
      });

      if (res && !res.error) {
        // Successful sign-in, redirect to the homepage after a delay
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        // Handle sign-in error (show an error message or stay on the page)
        console.error("Sign-in error:", res?.error);
      }
    }

    autoSignIn();
  }, [router]);
  return (
    <>
      <div className="flex w-full h-screen bg-slate-950 items-center justify-center">
        <button
          type="button"
          className="pointer-events-none inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 disabled:opacity-70 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
          disabled
        >
          <div
            className="inline-block mr-4 h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.4em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
          <span className="text-xl">Navigating you to Home...</span>
        </button>
      </div>
    </>
  );
}
