"use client";

import { clientOptions } from "@/app/constants/constants";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const baseUrl = "https://api.themoviedb.org/3/movie/";

const movieReview = ({ params }: { params: { id: string } }) => {
  const movieid = params.id;
  const { data: session } = useSession();
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>();
  const [movieData, setMovieData] = useState<any>(null);

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
          `${baseUrl}${movieid}?${process.env.NEXT_PUBLIC_MOVIE_API_KEY}`,
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

    //We don't allow the users to rate however they want
    if (rating < 1 || rating > 10) {
      setError("Rating must be between 1 and 5");
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
      alert("Review added successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "You must be connected to post a review"
      );
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Write a Review for {movieData?.title || "Loading..."}</h1>
        <textarea
          name="reviewText"
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="p-2 border"
          required
        />
        <label>
          Rating (1-10):
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={0}>Select rating</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rate) => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default movieReview;
