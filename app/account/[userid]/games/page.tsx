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

  return (
    <div className="back-img h-screen flex text-center justify-center">
      <Link href={`/`} className="absolute pointer-events-none">
        <h2 className=" ml-4 mt-4 text-white pointer-events-auto text-2xl transition duration-100 p-1 rounded-full hover:scale-110">
          &#8618; Home
        </h2>
      </Link>
      <div className="flex rounded-2xl items-center shadow-lg my-28 bg-slate-300">
        <UserOptions />
        {/* option content */}
        <div className="flex flex-grow flex-col h-full items-center mr-20 gap-0 mt-12">
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
        </div>
      </div>
    </div>
  );
};

export default Account;
