"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";
import PopupForLib from "@/app/components/Game-components/PopupForLib";

//utils
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { User } from "@/app/collection/connection";
import Footer from "@/app/components/Footer";

type GameData = {
  reviewId?: number;
  libraryId?: number;
} | null;

const Account = ({ params }: { params: { userid: string } }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [popupLib, setPopupLib] = useState<boolean>(false);
  const [popupRev, setPopupRev] = useState<boolean>(false);
  const [data, setData] = useState<GameData>(null);
  const { userid } = params;

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
      const response = await fetch(`/api/users/${userid}/deleteFromRev`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: userid, reviewId: data?.reviewId }), // Ensure you are passing the correct userId
      });

      if (response.ok) {
        alert("Review removed from list");
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // Handle the case when user is null
          return {
            ...prevUser,
            user_reviews: prevUser.user_reviews?.filter(
              (game) => game.reviewId !== data?.reviewId
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
      const response = await fetch(`/api/users/${userid}/deleteFromLib`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: userid, libraryId: data?.libraryId }), // Ensure you are passing the correct userId
      });

      if (response.ok) {
        alert("Game was removed from library");
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // Handle the case when user is null
          return {
            ...prevUser,
            library: prevUser.library?.filter(
              (game) => game.libraryId !== data?.libraryId
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

  // Fetch the user's profile picture from the database on component mount
  useEffect(() => {
    const fetchUser = async (userid: String) => {
      try {
        const response = await fetch(`/api/users/${userid}`, {
          method: "GET",
        });
        const responseData = await response.json();
        setUser(responseData.data);
        setImageUrl(responseData.data.profilePicture);
        setIsSuccess(responseData.success);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsSuccess(false);
      }
    };
    if (userid) {
      fetchUser(userid);
    }
  }, [userid]);

  // Fetch the user's profile picture from the database on component mount
  const imageSizes = "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw";
  return (
    <div className="w-full h-screen flex-col flex">
      <div className="back-img  overflow-auto relative w-full h-full flex text-center justify-center">
        <Link href={`/`} className="absolute pointer-events-none">
          <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
            &#8618; Home
          </h2>
        </Link>
        {isSuccess && user && (
          <div className="flex min-[912px]:flex-row sm:w-auto overflow-hidden overflow-y-auto w-5/6 flex-col rounded-2xl items-strech shadow-lg h-[40rem] sm:my-24 mb-10 mt-20 sm:mx-10 mx-0 bg-slate-300">
            <UserOptions />
            {/* option content */}
            <div className="flex flex-col items-center h-auto min-[912px]:mx-12 max-[911px]:mb-12 mx-0 gap-0 sm:mt-12 mt-8">
              <div className="relative w-20 h-20 rounded-full overflow-hidden group">
                <img
                  src={imageUrl || "/assets/images/default_avatar.jpg"}
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 mt-8 sm:w-[35rem] ">
                <div className="flex min-[912px]:flex-row overflow-hidden flex-col gap-2 items-center justify-between">
                  <label className="text-blue-950 font-black text-lg">
                    My Reviews:{" "}
                  </label>
                  <div className="text-blue-900 overflow-y-auto bg-slate-200 border h-44 sm:w-[28rem] min-[420px]:w-[21rem] w-[15rem] border-blue-400 rounded-md p-1">
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
                            (a, b) =>
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
                              <strong>Reaction:</strong> {review.reaction}{" "}
                              <br />
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
                  <label className="text-blue-950 font-black text-lg">
                    My Game Library:{" "}
                  </label>
                  <div className="text-blue-900 bg-slate-300 overflow-y-auto border h-60 min-[912px]:w-[52rem] sm:w-[32rem] min-[420px]:w-[20rem] w-[15rem] border-blue-400 rounded-md p-1">
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
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .map((list: any) => (
                            <li
                              key={list.libraryId}
                              className="overflow-x-auto justify-between flex gap-4 sm:flex-row flex-col sm:items-center items-stretch relative sm:pr-4 pr-0 mb-8 sm:mx-8 mx-2 text-start rounded-xl bg-slate-100"
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
                                  className="md:border-r-4 w-full sm:h-28 h-38 object-cover border-none sm:rounded-l-lg border-white transition duration-500 ease-in-out"
                                />
                              </div>
                              <span className="sm:mt-0 sm:ml-4 -mt-4 font-black">
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
      </div>
      <Footer />
    </div>
  );
};

export default Account;
