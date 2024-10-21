"use client"; // Ensure this component is treated as a Client Component
import { FormEvent, useEffect, useState, Suspense } from "react";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function Signin() {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // Use `get` to retrieve specific query parameter

  useEffect(() => {
    if (error === "EmailInUse") {
      setErrorMessages([
        "The email you used is already associated with another account. Please use a different email or log in with the existing credentials.",
      ]);
    }
  }, [error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessages([]); // Clear previous errors

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    let password = formData.get("password") as string;

    const errors: string[] = [];

    // Check if email exists with a provider
    const response = await fetch(`/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send the email to the backend
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Failed to check email existence");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    if (
      result.data.provider === "google" ||
      result.data.provider === "github" ||
      result.data.provider === "facebook"
    ) {
      setLoading(false);
      setErrorMessages([
        `This email is already associated with another provider: ${result.data.provider}`,
      ]);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // Disable automatic redirect
        email,
        password,
        callbackUrl: "/", // The URL to redirect to after sign-in
      });

      if (result?.error) {
        setLoading(false);
        setErrorMessages(["email or password is incorrect"]);
      } else {
        console.log("User credentials OK.");
        router.push(result?.url || "/");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during credentials' check:", error);
      setErrorMessages(["An unexpected error occurred"]);
    }
  };

  return (
    <div className="flex items-center flex-col overflow-auto fixed py-32 w-full h-screen bg-[url('/assets/images/moon-knight.jpg')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col xl:w-[25vw] lg:w-[35vw] md:w-[45vw] w-[55vw] relative  bg-neutral-200 border rounded-lg border-black max-[500px]:w-5/6"
      >
        <div className="bg-black flex items-center justify-center rounded-t-md p-5">
          <h1 className="sm:text-5xl text-3xl text-white">Sign-In</h1>
        </div>

        <div className="flex flex-col w-full items-center sm:mt-6 mt-4 ">
          <label className="sm:text-lg text-md">Email</label>
          <input
            type="email"
            name="email"
            className="border-2 text-lg sm:w-auto w-52 border-black sm:p-2 p-1 rounded-2xl"
            required
          />
        </div>
        <div className="flex flex-col w-full items-center sm:mt-6 mt-8 mb-10">
          <label className="sm:text-lg text-md">Password</label>
          <input
            type="password"
            name="password"
            className="border-2 text-lg sm:w-auto w-52 border-black sm:p-2 p-1 rounded-2xl"
            required
          />
        </div>
        <div className="flex items-center justify-center mb-6 w-full">
          <span className="bg-black p-1 px-4 rounded-md text-white">OR</span>
        </div>
        <div className="flex flex-row gap-8 justify-center mb-10">
          <FaGithub
            size={40}
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
          />
          <FaGoogle
            size={40}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
          />
        </div>
        {errorMessages.length > 0 && (
          <div className="text-red-600 flex justify-center">
            <ul className="bg-red-200 w-full text-center p-4">
              {errorMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        {loading && (
          <div className="flex mb-8 items-center justify-center">
            <p className="bg-neutral-400 rounded-md p-4">
              Loading, please wait...
            </p>
          </div>
        )}
        <div className="flex-grow ">
          <button
            type="submit"
            className="bg-black text-lg h-full w-full text-white  px-10 py-3 rounded-b-md hover:bg-neutral-700 transition-all duration-200  right-0 bottom-0"
          >
            Sign
          </button>
        </div>
      </form>
      <div className="mt-8 mx-10">
        <Link
          href="/Sign/Signup"
          className="hover:text-neutral-400 hover:underline sm:text-white text-slate-300 sm:bg-black sm:p-4 p-0 rounded-xl text-lg"
          style={{
            textShadow:
              "1px 1px 2px black, -1px -1px 2px black, -1px 1px 2px black, 1px -1px 2px black",
          }}
        >
          Already have an account? Click here to sign-up
        </Link>
      </div>
    </div>
  );
}
export default function SigninFallBack() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signin />
    </Suspense>
  );
}
