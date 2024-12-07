"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPlus, FaCheck } from "react-icons/fa";

interface AddToWatchlistProps {
  movieId: number;
}

const AddToWatchlist = ({ movieId }: AddToWatchlistProps) => {
  const [userId, setUserId] = useState<string | undefined>(); // Store the user ID from the session
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (session?.user?.email) {
        try {
          // Fetch the user details using the email
          const response = await fetch(
            `/api/getUserDetails/${session.user.email}`
          );

          if (!response.ok) {
            console.error("Error fetching user details:", response.statusText);
            return;
          }

          const data = await response.json();          

          if (data?._id) {
            setUserId(data._id);

            // Check if the movie is already in the user's watchlist
            if (data.watchlist && Array.isArray(data.watchlist)) {
              const movieInWatchlist = data.watchlist.some(
                (item: any) => item === movieId
              );              
              setIsInWatchlist(movieInWatchlist);
            } else {
              console.error("Watchlist not found or is not an array.");
            }
          } else {
            console.log("No profile found for this user.");
          }
        } catch (error) {
          console.error("Failed to fetch profile details:", error);
        }
      }
    };

    fetchProfileDetails();
  }, [session?.user?.email, movieId]); // Add movieId as dependency

  // Add the movie to the watchlist of the user
  const handleAddToWatchlist = async () => {
    if (!userId) {
      console.error("No user ID found, cannot add to watchlist.");
      return;
    }

    try {
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
      } else {
        alert(data.message || "Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Failed to add movie to watchlist:", error);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="text-center">
        <button
          onClick={handleAddToWatchlist}
          className={`ml-8 rounded-full py-2 px-6 hover:opacity-75 transition duration-200 bg-[#5d6770] text-white`}
          disabled={isInWatchlist}
        >
          {isInWatchlist ? (
            <div className="flex items-center gap-2">
              <FaCheck color="white" />
              <span>Added to watchlist</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaPlus color="white" />
              <span>watchlist</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddToWatchlist;
