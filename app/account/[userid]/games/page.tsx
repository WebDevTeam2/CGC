"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";

//utils
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { UploadButton } from "../../utils/uploadthing";
import Link from "next/link";

const Account = () => {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [data, setData] = useState(null);

  // Fetch the user's profile picture from the database on component mount
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (session?.user?.email) {
        try {
          // Fetch the profile picture using the email as a query param
          const response = await fetch(
            `/api/getImage?email=${session.user.email}`
          );

          if (!response.ok) {
            console.error(
              "Error fetching profile picture:",
              response.statusText
            );
            return;
          }

          // Parse the response as JSON
          const data = await response.json();

          // Check if the data contains a valid profile picture
          if (data?.profilePicture) {
            setImageUrl(data.profilePicture); // Set the imageUrl state to the saved profile picture
          } else {
            console.log("No profile picture found for this user.");
          }
        } catch (error) {
          console.error("Failed to fetch profile picture:", error);
        }
      }
    };

    fetchProfilePicture();
  }, [session?.user?.email]); // Only re-run this effect if the session changes

  return (
    <div className="back-img h-screen flex text-center justify-center">
      <Link href={`/`} className="absolute pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      <div className="flex justify-center rounded-2xl items-center shadow-lg my-28 bg-slate-300">
        <UserOptions />
        {/* option content */}
        <div className="flex flex-col h-full items-center mr-10 gap-0 mt-12">
          {imageUrl ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden group">
              <Image
                src={imageUrl}
                alt="User Avatar"
                layout="fill"
                priority={true}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative w-20 h-20 rounded-full overflow-hidden group">
              <Image
                src={
                  session?.user?.image || "/assets/images/default_avatar.jpg"
                }
                alt="User Avatar"
                layout="fill"
                priority={true}
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={async (res) => {
                const imageUrl = res[0].url;
                setImageUrl(imageUrl);

                // Save the image URL to the backend (associate with user ID)
                await fetch("/api/saveImage", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: session?.user?.email, // Assuming you're using email as the identifier
                    profilePicture: imageUrl,
                  }),
                });
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-stretch justify-between mt-8">
              <span className="text-blue-950">Username: </span>
              <span className="text-blue-900 text-end">
                {session?.user?.name || "No name available"}
              </span>
            </div>
            <div className="flex flex-row gap-2 items-stretch justify-between">
              <span className="text-blue-950">Email: </span>
              <span className="text-blue-900 text-end">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
