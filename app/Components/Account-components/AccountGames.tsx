"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import UserOptions from "./UserOptions";
import PopupForLib from "../Game-components/PopupForLib";
import { User } from "@/app/Constants/constants";
import Footer from "../Footer";
import { useSession } from "next-auth/react";

type GameData = {
  reviewId?: number;
  libraryId?: number;
} | null;

const AccountGames = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(true);
  const [popupLib, setPopupLib] = useState<boolean>(false);
  const [popupRev, setPopupRev] = useState<boolean>(false);
  const [data, setData] = useState<GameData>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess && user) setIsLoaded(true);
  }, [isSuccess, user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/getUserDetails/${session.user.email}`, {
            method: "GET",
          });
          if (!res.ok) {
            console.error("Error fetching user details");
            return;
          }
          const data = await res.json();
          if (data?._id) {
            setUser(data);
          } else {
            console.log("No profile found for this user.");
          }
        } catch (error) {
          console.error("failed to fetch user profile", error);
        }
      }
    };
    fetchUser();
  }, [session?.user?.email]);

  // start of review section
  const handleDeleteRev = async (
    event: MouseEvent<HTMLButtonElement>,
    reviewId: number
  ) => {
    event.preventDefault();
    setPopupRev(true);
    setData({ reviewId });
  };

  const confirmDeleteRev = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}/deleteFromRev`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: user._id, reviewId: data?.reviewId }), // Ensure you are passing the correct userId
      });

      if (response.ok) {
        alert("Review removed from list");
        setUser((prevUser: any) => {
          if (!prevUser) return prevUser; // Handle the case when user is null
          return {
            ...prevUser,
            user_reviews: prevUser.user_reviews?.filter(
              (game: any) => game.reviewId !== data?.reviewId
            ),
          };
        });

        setPopupRev(false); // Hide the popup after the game is deleted
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`); // You might want to handle this in a more user-friendly way
        // Reset deleting state if there's an error
      }
    } catch (error) {
      console.error("Failed to remove game:", error);
      alert("An error occurred while removing the game."); // Handle this error gracefully
      // Reset deleting state on error
    }
  };

  const cancelDeleteRev = () => {
    setPopupRev(false);
    // Reset deleting state if user cancels
  };
  // end of review section

  // start of list section
  const handleDeleteLib = async (
    event: MouseEvent<HTMLButtonElement>,
    libraryId: number
  ) => {
    event.preventDefault();
    setPopupLib(true);
    setData({ libraryId });
  };

  const confirmDeleteLib = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}/deleteFromLib`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: user._id, libraryId: data?.libraryId }), // Ensure you are passing the correct userId
      });

      if (response.ok) {
        alert("Game was removed from library");
        setUser((prevUser: any) => {
          if (!prevUser) return prevUser; // Handle the case when user is null
          return {
            ...prevUser,
            library: prevUser.library?.filter(
              (game: any) => game.libraryId !== data?.libraryId
            ),
          };
        });

        setPopupLib(false); // Hide the popup after the game is deleted
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`); // You might want to handle this in a more user-friendly way
        // Reset deleting state if there's an error
      }
    } catch (error) {
      console.error("Failed to remove game:", error);
      alert("An error occurred while removing the game."); // Handle this error gracefully
      // Reset deleting state on error
    }
  };

  const cancelDeleteLib = () => {
    setPopupLib(false);
    // Reset deleting state if user cancels
  };
  // end of list section

  return (
    <div className="back-img overflow-auto relative w-full h-full flex flex-col text-center items-center">
      <Link href={`/`} className="w-full pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      {isSuccess && user && (
        <div className="flex sm:flex-row grow flex-col rounded-2xl shadow-lg mt-12 mb-[5.1rem] sm:mx-6 mx-4 bg-slate-300">
          <UserOptions />
          {/* option content */}
          <div className="flex flex-col items-center min-[912px]:mx-12 mx-0 gap-0 mt-8 mb-10">
            <div className="relative min-[912px]:w-20 min-[912px]:h-20 w-16 h-16 rounded-full overflow-hidden group">
              <img
                src={user.profilePicture || "/assets/images/default_avatar.jpg"}
                alt="User Avatar"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 mt-8 min-[540px]:w-[30rem] w-auto">
              <div className="flex min-[912px]:flex-row overflow-hidden flex-col gap-2 items-center justify-between">
                <label className="text-blue-950 font-black text-md">
                  My Reviews:{" "}
                </label>
                <div className="text-blue-900 overflow-y-auto bg-slate-200 border h-44 min-[912px]:w-[35rem] sm:w-[24rem] min-[465px]:w-[21rem] w-[16rem] border-blue-400 rounded-md p-1">
                  <style jsx global>{`
                    /* Custom Scrollbar Styling for Consistency */
                    ::-webkit-scrollbar {
                      width: 10px; /* Adjust the width of vertical scrollbar */
                      height: 10px; /* Adjust the height of horizontal scrollbar */
                    }

                    ::-webkit-scrollbar-thumb {
                      background-color: rgba(
                        0,
                        0,
                        0,
                        0.3
                      ); /* Custom color for scrollbar thumb */
                      border-radius: 10px; /* Rounded corners */
                    }

                    ::-webkit-scrollbar-track {
                      background: rgba(
                        0,
                        0,
                        0,
                        0.1
                      ); /* Background for scrollbar track */
                    }
                  `}</style>
                  {user.user_reviews && user.user_reviews.length > 0 ? (
                    <ul className="mt-6">
                      {user.user_reviews
                        .slice()
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((review: any) => (
                          <li
                            key={review.reviewId}
                            className="overflow-hidden text-ellipsis relative px-4 mb-6 sm:mx-8 mx-2 py-3 text-start text-nowrap rounded-xl bg-slate-300"
                          >
                            <button
                              onClick={(event) =>
                                handleDeleteRev(event, review.reviewId)
                              }
                              className="absolute right-0 transition duration-200 hover:bg-red-900 top-0 px-4 py-1 text-slate-100 rounded-bl-xl bg-red-700"
                            >
                              X
                            </button>
                            {popupRev && (
                              <PopupForLib
                                onConfirm={confirmDeleteRev}
                                onCancel={cancelDeleteRev}
                              />
                            )}
                            <strong>Game:</strong>{" "}
                            <span className="font-black">
                              {" "}
                              {review.gameName}{" "}
                            </span>{" "}
                            <br />
                            <strong>Reaction:</strong> {review.reaction} <br />
                            <strong>Review:</strong> {review.text} <br />
                            <strong>Date:</strong> {review.date}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              </div>
              <div className="flex min-[912px]:flex-row flex-col gap-2 items-center justify-between">
                <label className="text-blue-950 font-black text-md">
                  My Game Library:{" "}
                </label>
                <div className="text-blue-900 bg-slate-300 overflow-y-auto border h-60 min-[912px]:w-[52rem] sm:w-[24rem] min-[465px]:w-[23rem] w-[18rem] border-blue-400 rounded-md p-1">
                  <style jsx global>{`
                    /* Custom Scrollbar Styling for Consistency */
                    ::-webkit-scrollbar {
                      width: 10px; /* Adjust the width of vertical scrollbar */
                      height: 10px; /* Adjust the height of horizontal scrollbar */
                    }

                    ::-webkit-scrollbar-thumb {
                      background-color: rgba(
                        0,
                        0,
                        0,
                        0.3
                      ); /* Custom color for scrollbar thumb */
                      border-radius: 10px; /* Rounded corners */
                    }

                    ::-webkit-scrollbar-track {
                      background: rgba(
                        0,
                        0,
                        0,
                        0.1
                      ); /* Background for scrollbar track */
                    }
                  `}</style>
                  {user.library && user.library.length > 0 ? (
                    <ul className="mt-6">
                      {user.library
                        .slice()
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((list: any) => (
                          <li
                            key={list.libraryId}
                            className="overflow-x-auto overflow-y-hidden sm:h-24 h-auto justify-between flex sm:gap-2 gap-6 sm:flex-row flex-col sm:items-center items-stretch relative sm:pr-4 pr-0 mb-8 sm:mx-6 mx-10 text-start rounded-xl bg-slate-100"
                          >
                            <button
                              onClick={(event) =>
                                handleDeleteLib(event, list.libraryId)
                              }
                              className="absolute z-20 right-0 top-0 px-4 py-1 transition duration-200 text-slate-100 rounded-bl-xl hover:bg-red-900 bg-red-700"
                            >
                              X
                            </button>
                            {popupLib && (
                              <PopupForLib
                                onConfirm={confirmDeleteLib}
                                onCancel={cancelDeleteLib}
                              />
                            )}
                            <div className="relative w-full h-full">
                              <img
                                src={list.gamePic}
                                alt={list.gameName}
                                className="md:border-r-4 w-full h-full object-cover border-none sm:rounded-l-lg border-white transition duration-500 ease-in-out"
                              />
                            </div>
                            <span className="sm:mt-0 sm:ml-4 -mt-4 text-sm font-black">
                              {list.gameName}
                            </span>
                            <div className="flex sm:flex-col flex-row -mt-4">
                              <strong>Date:</strong>{" "}
                              {new Date(list.date).toLocaleDateString()}
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p>No Games saved.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoaded && <Footer />}
    </div>
  );
};

export default AccountGames;
