"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";

//utills
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";

const Account = () => {
  const { data: session } = useSession();

  return (
    <div className="back-img  h-screen flex text-center justify-center">
      <div className="flex justify-center rounded-2xl items-center shadow-lg my-28 bg-slate-300">
        <UserOptions />
        {/* option content */}
        <div className="flex flex-col h-full items-center mr-10 gap-0 mt-12">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={session?.user?.image || "/assets/images/default_avatar.jpg"} // An o xrhsths exei diko tou image to kanoume display alliws kanoume display ena default
              alt="User Avatar"
              layout="fill"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-stretch justify-between mt-8">
              <span className="text-blue-950">Username: </span>
              <span className="text-blue-900 text-end">
                {session?.user?.name}
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
