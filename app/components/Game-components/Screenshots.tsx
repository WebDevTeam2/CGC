"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const basePosterUrl = `https://api.rawg.io/api/games/`;
const apiPosterKey = "?key=f0e283f3b0da46e394e48ae406935d25";

interface PostPage {
  id: number;
  slug: string;
  name: string;
  next: string;
  previous: string;
  count: number;
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
    const fetchScreenshots = async (slug: string) => {
      try {
        const res = await fetch(
          basePosterUrl + slug + "/screenshots" + apiPosterKey
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
    <div className="relative w-1/3 flex flex-col gap-2 pt-12">
      <span className="font-bold text-white text-3xl">Screenshots</span>
      <div className="grid grid-cols-1 gap-2 text-balance transition-all duration-200 text-white">
        {screenshots && screenshots.length > 0 ? (
          screenshots.map((item, index) => (
            <Image
              key={index}
              role="button"
              alt={`game_screenshot_${index}`}
              src={item.image}
              width={300}
              height={300}
              className="transition-smooth hover:translate-x-4 duration-200 ease-in-out"
            />
          ))
        ) : (
          <span className="text-xl border-2 text-slate-200 text-center bg-slate-900 rounded-full p-4 w-64">
            No Screenshots found for this game
          </span>
        )}
      </div>
    </div>
  );
};

export default Screenshots;
