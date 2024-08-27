"use client"; // Ensure this component is treated as a Client Component
import { FormEvent, useState } from "react";
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

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    // Hash the password using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      password,
    };

    setLoading(true);

    try {
      // Send a POST request to your API route
      const response = await fetch("/api/users/login", {
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
        console.log("User credentials OK.");
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during credentials' check:", error);
      setErrorMessages(["An unexpected error occurred"]);
    }
  };

  return (
    <div className="flex items-center flex-col overflow-auto fixed justify-center w-full h-screen bg-[url('assets/images/moon-knight.jpg')] bg-cover bg-center">
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
          Don't have an account? Click here to sign-up
        </Link>
      </div>
    </div>
  );
}
