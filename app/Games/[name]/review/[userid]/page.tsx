"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = `key=076eda7a1c0e441eac147a3b0fe9b586`;

interface PostPage {
  id: number;
  slug: string;
  name: string;
  next: string;
  previous: string;
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

interface Post {
  page: number;
}

interface Rating {
  id: number;
  title: string;
  count: number;
}
interface CombinedParams extends PostPage, Post {}

const reactions = [
  { id: 5, reaction: "😃" },
  { id: 4, reaction: "🙂" },
  { id: 3, reaction: "🤔" },
  { id: 1, reaction: "😔" },
];

const getReaction = (id: number) => {
  const reaction = reactions.find((reaction) => reaction.id === id);
  return reaction ? reaction.reaction : "❓";
};

export default function Games({ params }: { params: CombinedParams }) {
  const [game, setGame] = useState<PostPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleReactionClick = (title: string) => {
    setSelectedReaction(title);
  };

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

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(
          basePosterUrl + params.name + "?" + apiPosterKey
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
  }, [params.slug]);

  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>Loading...</div>;

  const sortedRatings = game.ratings.sort(
    (a: Rating, b: Rating) => b.id - a.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      gameId: game?.id,
      gameName: game?.name, // Game's name
      selectedReaction, // Reaction's name
      reviewText, // Text from the textarea
      date: new Date(), // Current date
    };

    try {
      const response = await fetch(`/api/review/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        console.log("Review submitted successfully:", data);
        // alert(data.message || "Added to reviews");
        // Update reviews with the new review added
        setTimeout(() => {
          router.push(`/Games/${game.slug}`);
        }, 2000);
      } else {
        console.error("Error submitting review:", data.error);
        alert(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return isSubmitted ? (
    <div className="bg-black w-full h-screen flex items-center justify-center">
      <div className="text-slate-200 text-xl text-center">
        Your review has been submitted successfully!<br></br>Going back to the
        game
      </div>
    </div>
  ) : (
    <div className="bg-black bg-cover flex flex-col fixed overflow-hidden overflow-y-auto items-center h-screen w-full">
      <Link href={`/Games/${game.slug}`} className="w-full pointer-events-none">
        <button className="ml-4 mt-4 pointer-events-auto text-2xl text-white transition duration-100 hover:scale-110">
          ...Back to the Game
        </button>
      </Link>
      <form
        className="flex mt-12 mx-10 mb-10 flex-col relative bg-neutral-200 rounded-2xl"
        onSubmit={handleSubmit}
      >
        {/* Header of review */}
        <div className="sm:p-8 p-4 flex flex-col gap-3 font-sans border-2 rounded-t-2xl bg-black w-full">
          <span className="text-orange-400 font-extrabold sm:text-xl text-lg">
            Write a review
          </span>
          <span className="text-white sm:text-4xl text-2xl">{game.name}</span>
        </div>
        {/* Start of reactions */}
        <div className="sm:p-5 p-3 flex flex-wrap flex-row gap-3 font-serif border rounded-b-xl bg-black w-full">
          {sortedRatings.map((rating) => (
            <div
              role="button"
              onClick={() => handleReactionClick(rating.title)}
              key={rating.id} // Use unique ID for the key
              className={`flex transition-all duration-200 ${
                selectedReaction === rating.title
                  ? "bg-neutral-600"
                  : "bg-black"
              } hover:bg-neutral-600 items-center gap-2 border rounded-full pr-6 p-2`}
            >
              <span className="sm:text-3xl text-xl">
                {getReaction(rating.id)}
              </span>
              <span className="text-white text-xl">{rating.title}</span>
            </div>
          ))}
        </div>
        {/* Start of textarea */}
        <textarea
          className="text-xl pb-28 pt-8 px-8 rounded-t-2xl outline-none bg-neutral-200"
          placeholder="Type Here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <button
          className="text-xl transition-all rounded-b-2xl duration-200 bg-neutral-400 hover:bg-neutral-500 p-3"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
