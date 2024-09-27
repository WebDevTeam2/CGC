"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";

//utils
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const Account = ({ params }: { params: { userid: string } }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [data, setData] = useState(null);
  const { userid } = params;

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

  return (
    <div className="back-img fixed overflow-auto bg-cover w-full h-screen flex text-center justify-center">
      <Link href={`/`} className="absolute pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      {isSuccess && user && (
        <div className="flex sm:flex-row sm:w-auto overflow-hidden overflow-y-auto w-5/6 flex-col rounded-2xl items-strech shadow-lg h-[40rem] sm:my-24 mb-10 mt-20 sm:mx-10 mx-0 bg-slate-300">
          <UserOptions />
          {/* option content */}
          <div className="flex flex-col items-center h-auto sm:mr-20 mr-0 gap-0 sm:mt-12 mt-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden group">
              <Image
                src={imageUrl || "/assets/images/default_avatar.jpg"}
                alt="User Avatar"
                layout="fill"
                priority={true}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 mt-8 sm:w-[35rem] w-60">
              <div className="flex sm:flex-row overflow-hidden flex-col gap-2 items-center justify-between">
                <label className="text-blue-950 font-black text-lg">
                  My Reviews:{" "}
                </label>
                <div className="text-blue-900 overflow-y-auto bg-slate-200 border h-44 w-[28rem] border-blue-400 rounded-md p-1">
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
                      {user.user_reviews.map((review: any) => (
                        <li
                          key={review.gameId}
                          className="overflow-x-auto  px-4 mb-6 mx-8 py-3 text-start text-nowrap rounded-xl bg-slate-300"
                        >
                          <strong>Game:</strong> {review.gameName} <br />
                          <strong>Reaction:</strong> {review.reaction} <br />
                          <strong>Review:</strong> {review.text} <br />
                          <strong>Date:</strong>{" "}
                          {new Date(review.date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              </div>
              <div className="flex  sm:flex-row flex-col gap-2 items-center justify-between">
                <label className="text-blue-950 font-black text-lg">
                  My Game Library:{" "}
                </label>
                <div className="text-blue-900 bg-slate-200 overflow-y-auto border h-60 w-[39rem] border-blue-400 rounded-md p-1">
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
                      {user.library.map((list: any) => (
                        <li
                          key={list.gameId}
                          className="overflow-x-auto  px-4 mb-14 mx-8 py-3 text-start  rounded-xl bg-slate-300"
                        >
                          <strong>Game:</strong>{" "}
                          <span className=" font-black">{list.gameName}</span>{" "}
                          <br />
                          <strong>Description:</strong> {list.gameDesc} <br />
                          <strong>Date:</strong>{" "}
                          {new Date(list.date).toLocaleDateString()}
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
  );
};

export default Account;
