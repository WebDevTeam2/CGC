"use client"; // Enable client-side behavior for redirect

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verified() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  useEffect(() => {
    // Automatically start the session for the user after email verification
    async function startSession() {
      try {
        // Make an API call to your backend to handle session creation for the user
        const res = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Send verified email to backend
        });

        const response = await res.json();
        // console.log(response.data.email);
        if (res.ok) {
          console.log("inside");
          // Redirect to the homepage or any desired page after starting the session
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          // Handle error (stay on page or display an error message)
          console.error("Session start error:", response.message);
        }
      } catch (error) {
        console.error("Error in session start:", error);
      }
    }

    if (email) {
      startSession(); // Start session once email is verified
    }
  }, [router, email]);

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
