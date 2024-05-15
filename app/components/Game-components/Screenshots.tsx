"use client";
import Image from "next/image";
import { GrNext, GrPrevious } from "react-icons/gr";
import React, { useEffect, useState } from "react";

const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = "?key=f0e283f3b0da46e394e48ae406935d25";

interface Post {
  page: number;
  results: PostPage[];
}
interface PostPage {
  id: number;
  slug: string;
  name: string;
  results: [
    {
      id: number;
      image: string;
      width: number;
      height: number;
      is_deleted: boolean;
      name: string;
      preview: string;
      data: {
        480: string;
        max: string;
      };
    }
  ];
}

const Screenshots = ({ params }: { params: PostPage }) => {
  //parsing specifically elements of the results array so that i can say item.image
  const [screenshots, setScreenshots] = useState<PostPage["results"]>();

  useEffect(() => {
    const fetchScreenshots = async (name: string) => {
      try {
        const res = await fetch(
          basePosterUrl + name + "/screenshots" + apiPosterKey
        );
        const data = await res.json();

        // Store only the results array
        setScreenshots(data.results);
      } catch (error) {
        console.error("Error fetching screenshots:", error);
      }
    };
    fetchScreenshots(params.name);
  }, []);

  return (
    <div className="relative flex flex-col gap-2 pt-12">
      <span className="font-bold text-white text-3xl">Screenshots:</span>
      <div className="flex overflow-hidden overflow-x-visible flex-row gap-2 text-balance text-white">
        <div className="arrows flex absolute w-full justify-between z-10 text-white text-4xl">
          <button className="border rounded-full p-2 bg-slate-900">
            <GrPrevious />
          </button>
          <button className="border rounded-full p-2 bg-slate-900">
            <GrNext />
          </button>
        </div>
        {screenshots?.map((item, index) => (
          <Image
            key={index}
            role="button"
            alt={`game_screenshot_${index}`}
            src={item.image}
            width={300}
            height={300}
          />
        ))}
      </div>
    </div>
  );
};

export default Screenshots;
