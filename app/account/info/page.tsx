"use client";
//components
import UserOptions from "@/app/components/Account-components/UserOptions";

//utills
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";

const Account = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-[#eee3cb] h-screen flex text-center justify-center">
      <div className="flex justify-center items-center shadow-lg my-12 bg-[#47475c]">
        <UserOptions />
        {/* option content */}
        <div className="flex flex-col items-center gap-8 h-full lg:mt-12">
          <div className="relative w-20 h-20 lg:ml-6 block rounded-full overflow-hidden">
            <Image
              src={session?.user?.image || "/assets/images/batman.jpg"} // An o xrhsths exei diko tou image to kanoume display alliws kanoume display ena default
              alt="User Avatar"
              layout="fill"
              className="object-cover"
            />
          </div>
          <div className="flex flex-row gap-6 text-[#cccccc]">  
            <span>Username: </span>
            <span>{session?.user?.name}</span>
          </div>
          <div className="flex flex-row gap-6 text-[#cccccc]">
            <span>email: </span>
            <span>{session?.user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
