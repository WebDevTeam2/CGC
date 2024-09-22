"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AddToWatchlistProps {
  movieId: number;
  userId: string; // Accept the userId as a prop
}

const AddToWatchlist = ({ movieId }: AddToWatchlistProps) => {
  const [userId, setUserId] = useState<string>(); //So that we can store the user id from the session
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (session?.user?.email) {
        try {
          // Fetch the profile picture using the email as a query param
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
  }, [session?.user?.email]); // Only re-run this effect if the session changes

  // Add the movie to the watchlist of the user
  const handleAddToWatchlist = async () => {
    const response = await fetch(`/api/watchlist/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });
    const data = await response.json();

    if (response.ok) {
      setIsInWatchlist(true);
      alert(data.message || "Added to watchlist");
    } else {
      setIsInWatchlist(false);
      alert(data.message || "Failed to add to watchlist");
    }
  };

  return (
    <div>
      <span className="add-to-watchlist text-center sm:ml-5 md:ml-[8rem] lg:ml-[18rem] lg:mt-10">
        <button
          onClick={handleAddToWatchlist} // Correct function call
          className={
            isInWatchlist
              ? "bg-green-500"
              : "ml-8 rounded-sm p-4 hover:opacity-75 transition duration-200 text-white bg-[#4c545b]"
          }
          disabled={isInWatchlist}
        >
          {isInWatchlist ? "Added to watchlist" : "Add to watchlist"}
        </button>
      </span>
    </div>
  );
};

export default AddToWatchlist;
