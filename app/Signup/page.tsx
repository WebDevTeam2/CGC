"use client"; // Ensure this component is treated as a Client Component
import { FormEvent, useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Signup() {
  const router = useRouter();
  const { data: session } = useSession();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      session ? router.push("/") : null;
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessages([]); // Clear previous errors

    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    let password = formData.get("password") as string;
    let passwordre = formData.get("passwordre") as string;

    const errors: string[] = [];

    // Username validation
    const usernameRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W]{10,}$/;
    if (!usernameRegex.test(username)) {
      errors.push(
        "Username must be at least 10 characters long, contain at least one capital letter, one number, and may include symbols."
      );
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d\W]{10,}$/;
    if (!passwordRegex.test(password)) {
      errors.push(
        "Password must be at least 10 characters long, contain at least one capital letter, and may include symbols."
      );
    }

    if (password !== passwordre) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      username,
      email,
      password: hashedPassword,
    };

    setLoading(true);

    try {
      // Send a POST request to your API route
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        setErrorMessages([result.message]);
      } else {
        setLoading(false);
        console.log("User added successfully, verification email sent.");
        alert(
          "A verification email has been sent to your email address. Please check your inbox."
        );
      }
    } catch (error) {
      console.error("Error during user addition:", error);
      setErrorMessages(["An unexpected error occurred"]);
    }
  };

  return (
    <div className="flex items-center flex-col overflow-auto fixed justify-center w-full h-screen bg-[url('assets/images/dishonored.jpg')] bg-cover bg-right">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col xl:w-[25vw] lg:w-[35vw] md:w-[45vw] w-[55vw] relative  bg-neutral-200 border rounded-lg border-black max-[500px]:w-5/6"
      >
        <div className="bg-black flex items-center justify-center rounded-t-md p-5">
          <h1 className="sm:text-5xl text-3xl text-white">Sign-Up</h1>
        </div>
        <div className="flex flex-col items-center mt-12">
          <label className="sm:text-lg text-md">Username</label>
          <input
            type="text"
            name="username"
            className="border-2 text-lg border-black  sm:p-2 p-1 rounded-2xl"
            required
          />
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
        <div className="flex flex-col w-full items-center sm:mt-6 mt-4">
          <label className="sm:text-lg text-md">Password</label>
          <input
            type="password"
            name="password"
            className="border-2 text-lg border-black sm:p-2 p-1 rounded-2xl"
            required
          />
        </div>
        <div className="flex flex-col w-full items-center mb-12 sm:mt-6 mt-4 ">
          <label className="sm:text-lg text-md">Re-enter Password</label>
          <input
            type="password"
            name="passwordre"
            className="border-2 text-lg border-black sm:p-2 p-1 rounded-2xl"
            required
          />
        </div>
        <div className="flex flex-row gap-8 mt-2 justify-center">
          <FaGithub
            size={40}
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="cursor-pointer"
          />
          <FaGoogle
            size={40}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="cursor-pointer"
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
          href="/Signin"
          className="hover:text-neutral-400 hover:underline text-white bg-black p-4 rounded-xl text-lg"
        >
          Already have an account? Click here to sign-in
        </Link>
      </div>
    </div>
  );
}