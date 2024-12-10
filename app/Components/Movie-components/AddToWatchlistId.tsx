"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPlus, FaCheck } from "react-icons/fa";

interface AddToWatchlistProps {
  id: number;
  media_type: "movie" | "tv";
}

const AddToWatchlistId = ({ id, media_type }: AddToWatchlistProps) => {
  const[user, setUser] = useState<any>(null);
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
            setUser(data);

            // Check if the movie is already in the user's watchlist
            if (data.watchlist && Array.isArray(data.watchlist)) {
              const itemInWatchlist = data.watchlist.some(
                (item: any) => item.id === id && item.media_type === media_type
              );              
              setIsInWatchlist(itemInWatchlist);
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
  }, [session?.user?.email, id]); // Add movieId as dependency

  // Add the movie to the watchlist of the user
  const handleAddToWatchlist = async () => {
    if (!user?._id) {
      console.error("No user ID found, cannot add to watchlist.");
      return;
    }

    try {
      const response = await fetch(`/api/watchlist/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, media_type }),
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
      <div className="msm:mx-auto">
        <button
          onClick={handleAddToWatchlist}
          className={`rounded-sm py-2 px-6 hover:opacity-75 transition duration-200 watchlist-button bg-[#4b535a] text-white`}
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

export default AddToWatchlistId;
