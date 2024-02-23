import Nav from "@/components/Movie-components/Nav";
import { IoMdPerson } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { articleData } from "../constants/constants";

export default function TrendingPage() {
  return (
    <div>
      <Nav />
      <h1 className="flex items-center justify-center font-open-sans font-bold text-2xl mb-10">
        TOP 10 MOST WATCHED MOVIES ACCORDING TO NETFLIX
      </h1>

      <div className="flex flex-col items-center ml-[4.809rem] mr-[4.809rem] w-10/12 trending-page">
        {/* Kanw Link oloklhrh th kartela */}
        {articleData.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer "
            className="flex flex-row shadow-custom hover:scale-110 transition duration-700 ease-in-out group mb-14"
          >
            {/* aristero image */}
            <div className="w-48 h-48 p-10 relative contain content-none group-hover:opacity-0 transition duration-700 ease-in-out">
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                objectFit="contain"
                priority
              ></Image>
            </div>

            {/* image dipla apo ta images me ta noumera */}
            <div className="w-64 h-64 p-10 relative contain content-none">
              <Image
                src={item.src2}
                alt={item.alt2}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                className="w-full h-full absolute"
                priority
              ></Image>
            </div>

            {/* div pou tha krataei ton titlo ths tainias kai to description */}
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-2xl font-open-sans flex items-center justify-center">
                {item.title}
              </h2>

              <p className="mt-10 ml-10 text-xl object-contain">{item.desc}</p>
              {/* flex me tous hthopoious kai to icon */}
              <div className="flex items-center justify-center ml-auto mt-auto gap-4">
                <IoMdPerson />
                <span>{item.names}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
