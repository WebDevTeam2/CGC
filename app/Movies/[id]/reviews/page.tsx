"use client";
import { baseUrl, clientOptions, imageURL } from "@/app/Constants/constants";
import { profanityList } from "@/app/Constants/profanity";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";

const MovieReview = ({ params }: { params: { id: string } }) => {
  const movieid = params.id;
  const { data: session } = useSession();
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>();
  const [movieData, setMovieData] = useState<any>(null);
  const router = useRouter();

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
  }, [session?.user?.email]); // Only re-run this effect if the session changes\

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}movie/${movieid}?api_key=${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`,
          clientOptions
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };
    fetchMovieData();
  }, [movieid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //We don't allow the users to post a review if it contains any profanity
    const words = review.toLowerCase().trim().split(" ");
    for (const word of words) {
      if (profanityList.has(word)) {
        setError("Your review contains inappropriate language.");        
        return;
      }
    }
    //We don't allow the users to post a review if they are not connected
    if (!session) {
      setError("You must be connected to post a review");
      return;
    }

    //We don't allow the users to rate however they want
    if (rating < 1 || rating > 10) {
      setError("Rating must be between 1 and 10");
      return;
    }

    try {
      const res = await fetch(`/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          movieid: Number(movieid),
          movieName: movieData?.title,
          review,
          rating,
        }),
      });
      //redirecting user to the movie page
      setTimeout(() => {
        alert(`Review added successfully, redirecting to ${movieData?.title} page`);
        router.push(`/Movies/${movieid}`);
        router.refresh();
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };
  return (
    <div className="flex flex-col gap-2 justify-center text-center md:mt-12 lg:mt-16 items-center">
      <h1 className="text-bold text-3xl mb-4 md:mb-0 lg:mb-0">
        {movieData?.title}
      </h1>
      <div className="flex justify-center gap-4 items-center md:mb-2 review-page">
        <div className="relative w-56 h-72 md:w-72 md:h-96 lg:w-72 lg:h-96">
          <img
            src={`${imageURL}${movieData?.poster_path}`}
            alt={`${movieData?.title} poster`}
            className="object-cover absolute w-full h-full"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 review-form"
        >
          <textarea
            name="reviewText"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="lg:mt-10 md:mt-8 border border-gray-300 shadow-gray-600 bg-[#e8e8e8] p-4 rounded-lg shadow-md w-60 h-52 md:h-64 lg:h-64 md:w-60 lg:w-72 overflow-auto user-review-text resize-none"
            required
          />

          <label className="flex items-center gap-2">
            Rating (1-10):
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-md w-12 ml-2 p-1 rating-select focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value={0}>--</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}
                </option>
              ))}
            </select>
            <FaStar style={{ color: "gold" }} />
          </label>

          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="p-2 bg-blue-500 text-white mb-12">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieReview;
