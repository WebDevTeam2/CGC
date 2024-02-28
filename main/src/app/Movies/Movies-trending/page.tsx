"use client";
import React, { useState } from "react";
import Nav from "@/components/Movie-components/Nav";
import ChangeTab from "@/components/Movie-components/ChangeTab";
import { IoMdPerson } from "react-icons/io";
import Image from "next/legacy/image";
import Link from "next/link";
import { articleData } from "../../constants/constants";

export default function TrendingPage() {
  return (
    <div>
      <Nav />
      <div className="sm:flex-col flex lg:flex-row gap-4 items-center justify-center font-open-sans font-bold text-2xl mb-10 not-search">
        <ChangeTab />
        <h1>TOP 10 MOST WATCHED MOVIES ACCORDING TO NETFLIX</h1>
      </div>

      <div className="flex flex-col items-center ml-[8rem] mr-[4.809rem] w-10/12 trending-page not-search">
        {/* Kanw Link oloklhrh th kartela */}
        {articleData.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer "
            className="flex flex-row shadow-custom lg:hover:scale-110 transition duration-700 ease-in-out group mb-14"
          >
            {/* aristero image */}
            <div className="w-52 h-52 p-10 relative contain content-none lg:group-hover:opacity-0 transition duration-700 ease-in-out">
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>

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
