"use client";
import React, { useState } from "react";
import Footer from "../Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ObjectId } from "mongodb";

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

interface Info {
  userId: ObjectId;
  game: PostPage;
}

const WriteReview: React.FC<Info> = ({ userId, game }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>("");
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const router = useRouter();

  const handleReactionClick = (title: string) => {
    setSelectedReaction(title);
  };
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
        setTimeout(() => {
          router.push(`/Games/${game.slug}`);
          //this command is for the reviews to be updated automatically when navigating back to the game
          router.refresh();
        }, 2000);
      } else {
        console.error("Error submitting review:", data.error);
        alert(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sortedRatings = game.ratings.sort((a: any, b: any) => b.id - a.id);

  return isSubmitted ? (
    <div className="bg-black w-full h-screen flex items-center justify-center">
      <div className="text-slate-200 text-lg text-center">
        Your review has been submitted successfully!<br></br>Going back to the
        game
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <Link
        href={`/Games/${game.slug}`}
        className="w-full invisible pointer-events-none"
      >
        <button className="ml-4 mt-4 pointer-events-auto text-xl text-white transition duration-100 hover:scale-110">
          ...Back to the Game
        </button>
      </Link>
      <form
        className="flex mt-12 mx-10 mb-[5.1rem] flex-col flex-1 relative bg-neutral-200 rounded-2xl"
        onSubmit={handleSubmit}
      >
        {/* Header of review */}
        <div className="sm:p-8 p-4 flex flex-col gap-3 font-sans border-2 rounded-t-2xl bg-black w-full">
          <span className="text-orange-400 font-extrabold sm:text-xl text-md">
            Write a review
          </span>
          <span className="text-white sm:text-2xl text-xl">{game.name}</span>
        </div>
        {/* Start of reactions */}
        <div className="sm:p-5 p-3 flex flex-wrap flex-row gap-3 font-serif border rounded-b-xl bg-black w-full">
          {sortedRatings.map((rating: any) => (
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
              <span className="sm:text-xl text-lg">
                {getReaction(rating.id)}
              </span>
              <span className="text-white text-lg">{rating.title}</span>
            </div>
          ))}
        </div>
        <textarea
          className="text-lg pb-48 pt-8 px-8 rounded-t-2xl outline-none bg-neutral-200"
          placeholder="Type Here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <button
          className="text-lg transition-all rounded-b-2xl duration-200 bg-neutral-400 hover:bg-neutral-500 p-3"
          type="submit"
        >
          Submit
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default WriteReview;
