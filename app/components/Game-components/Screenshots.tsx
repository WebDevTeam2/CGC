"use client";
import Image from "next/image";
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
  const [screenshots, setScreenshots] = useState<PostPage[]>([]);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const res = await fetch(
          `${basePosterUrl}${params.name}/screenshots${apiPosterKey}`
        );
        const data: Post = await res.json();
        setScreenshots(data.results);
        // setWrapper(data);
      } catch (error) {
        console.error("Error fetching screenshots:", error);
      }
    };

    fetchScreenshots();
  }, []);

  return (
    <div className="relative flex flex-col gap-2 pt-12">
      <span className="font-bold text-white text-3xl">Screenshots:</span>
      <div className="flex overflow-hidden overflow-x-visible flex-row gap-2 text-balance text-white">
        {screenshots.map((screen: PostPage, index: number) => (
          <ul key={index}>
            {screen.results.map((item, itemIndex) => (
              <li key={itemIndex} role="button" tabIndex={0}>
                <Image
                  alt="game_screenshots"
                  src={item.image}
                  width={300}
                  height={300}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Screenshots;
