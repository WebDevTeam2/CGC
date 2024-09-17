"use client"; // Ensure this component is treated as a Client Component
import { FormEvent, useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signin() {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessages([]); // Clear previous errors

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    let password = formData.get("password") as string;

    const errors: string[] = [];

    // Check if email exists with a provider
    const emailCheckResponse = await fetch("/api/checkEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const emailCheckData = await emailCheckResponse.json();

    if (emailCheckData.exists && emailCheckData.provider) {
      // If email is already linked to a provider
      setErrorMessages([
        "Email already exists with a provider. Please sign in using that provider.",
      ]);
      return;
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
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
    <div className="flex items-center flex-col overflow-auto fixed justify-center w-full h-screen bg-[url('/assets/images/moon-knight.jpg')] bg-cover bg-center">
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
            className="border-2 text-lg border-black sm:p-2 p-1 rounded-2xl"
            required
          />
        </div>
        <div className="flex flex-col w-full items-center sm:mt-6 mt-8 mb-10">
          <label className="sm:text-lg text-md">Password</label>
          <input
            type="password"
            name="password"
            className="border-2 text-lg border-black sm:p-2 p-1 rounded-2xl"
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
      <div className="mt-10">
        <Link
          href="/Signup"
          className="hover:text-neutral-400 hover:underline text-white bg-black p-4 rounded-xl text-lg"
        >
          Dont have an account? Click here to sign-up
        </Link>
      </div>
    </div>
  );
}
