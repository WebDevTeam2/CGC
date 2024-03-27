import ChangeTab from "@/components/Movie-components/ChangeTab";
import Image from "next/legacy/image";
import Link from "next/link";
import {
  movieData,
  toDashed,
} from "@/app/constants/constants";

export default async function TrendingPage() {
  return (
    <main className="trending-page">
      <ChangeTab />

      <div className="flex flex-col items-center ml-[8rem] mr-[4.809rem] w-10/12 trending-page not-search">
        {/* Kanw Link oloklhrh th kartela */}
        {movieData.map((item) => (
          <Link
            key={item.id}
            href={"/Movies/[MovieLink]" } as={`/${toDashed(item.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row shadow-custom lg:hover:scale-110 transition duration-700 ease-in-out group ml-16 mb-14 "
          >
            {/* image dipla apo ta images me ta noumera */}
            <div className="sm:w-48 lg:w-64 lg:h-64 p-10 relative contain content-none">
              <Image
                src={item.src2}
                alt={item.alt2}
                layout="fill"
                objectFit="cover"
                className="w-full h-full absolute"
                priority
              />
            </div>

            {/* div pou tha krataei ton titlo ths tainias kai to description */}
            <div className="flex flex-col gap-2">
              <h2 className="font-bold text-2xl font-open-sans flex items-center justify-center">
                {item.title}
              </h2>

              <p className="mt-10 ml-10 text-xl object-contain">{item.desc}</p>
              {/* flex me tous hthopoious kai to icon */}
              <div className="flex items-center justify-center ml-auto mt-auto gap-4">
                <span>{item.names}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
