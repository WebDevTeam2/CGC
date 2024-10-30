"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const basePosterUrl = process.env.NEXT_PUBLIC_BASE_POSTER_URL;
const apiPosterKey = process.env.NEXT_PUBLIC_API_KEY;
const message = "hello from apostolos";

interface PostPage {
  id: number;
  slug: string;
  name: string;
  next: string;
  previous: string;
  description_raw: string;
  ratings_count: number;
  ratings: [
    {
      id: number;
      title: string; //this is the one I want
      count: number;
    }
  ];
  background_image: string;
}

const AddToList = () => {
  const [userId, setUserId] = useState<string>(); //So that we can store the user id from the session
  const [isInList, setIsInList] = useState(false);
  const [game, setGame] = useState<PostPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const pathname = usePathname(); // Get the current path
  const gameName = pathname?.split("/")[2];

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
            // console.log(data);
            if (data.library.some((item: any) => item.gameId === game?.id)) {
              setIsInList(true); // Game is already in the list
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
  }, [session?.user?.email, game?.id]); // Only re-run this effect if the session changes

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(
          basePosterUrl + "/" + gameName + "?" + apiPosterKey
        );
        if (!res.ok) {
          throw new Error("Failed to fetch game data");
        }
        const data = await res.json();
        setGame(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchGame();
  }, [game?.slug]);

  // Add the movie to the watchlist of the user
  const handleAddToList = async () => {
    const ListData = {
      gameId: game?.id,
      gameName: game?.name, // Game's name
      gamePic: game?.background_image,
      date: new Date(), // Current date
    };
    const response = await fetch(`/api/list/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ListData),
    });
    const data = await response.json();

    if (response.ok) {
      setIsInList(true);
      console.error(data.message);
    } else {
      setIsInList(false);
      console.error(data.message);
    }
  };

  return (
    <div>
      <span>
        <button
          onClick={handleAddToList} // Correct function call
          className={`
              py-1 px-4 rounded-xl transition-all duration-200 
           ${
             isInList
               ? "text-black bg-slate-300"
               : "text-black bg-slate-100 hover:bg-slate-300 hover:scale-105"
           }`}
          disabled={isInList}
        >
          {isInList ? "Game added to your list" : "+ Add to your library"}
        </button>
      </span>
    </div>
  );
};

export default AddToList;
