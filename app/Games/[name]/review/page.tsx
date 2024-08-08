import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";
import Screenshots from "@/app/components/Game-components/Screenshots";
import Link from "next/link";

export default async function Games() {
  return (
    <div className="bg-black flex items-center justify-center bg-cover h-screen w-full">
      <form className="w-2/5 h-[60vh] relative bg-neutral-200 rounded-2xl">
        <div className="font-sans p-3 border-2 rounded-t-2xl absolute top-0 text-white text-4xl bg-black w-full">
          Write a review
        </div>
      </form>
    </div>
  );
}
