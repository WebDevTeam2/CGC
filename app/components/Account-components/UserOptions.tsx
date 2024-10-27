"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const UserOptions = () => {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string>("");

  // // Fetch the user's details from the database on component mount
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (session?.user?.email) {
        try {
          // Fetch response using the email as a query param
          const response = await fetch(
            `/api/getUserDetails?email=${session.user.email}`
          );

          if (!response.ok) {
            console.error("Error fetching user details:", response.statusText);
            return;
          }

          // Parse the response as JSON
          const data = await response.json();

          // Check if the data contains a valid id
          if (data?._id) {
            setUserId(data._id);
          } else {
            console.log("No profile found for this user.");
          }
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        }
      }
    };

    fetchProfileDetails();
  }, [session?.user?.email]); // Only re-run this effect if the session changes\

  return (
    <div className="bg-[#23232e] min-[912px]:rounded-l-2xl rounded-lt-xl h-full">
      <ul className="text-[#b6b6b6] pt-2 sm:text-md text-sm divide-y flex flex-col">
        <Link href={`/account/${userId}/info`}>
          <li className="cursor-pointer transition-all duration-200 hover:text-white p-4">
            Account Details
          </li>
        </Link>
        <Link href={`/account/${userId}/games`}>
          <li className="cursor-pointer transition-all duration-200 hover:text-white p-4">
            Games
          </li>
        </Link>
        <Link href={`/account/${userId}/movies`}>
          <li className="cursor-pointer transition-all duration-200 hover:text-white p-4">
            Movies
          </li>
        </Link>
        <li
          className="cursor-pointer transition-all duration-200 hover:text-white p-4"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </li>
      </ul>
    </div>
  );
};

export default UserOptions;
