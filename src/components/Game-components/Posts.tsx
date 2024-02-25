"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

//JS library to handle HTTP requests,enabling the application
//to retrieve data from external sources(API's)
import axios from "axios";

type Post = {
  id: number;
  title: string;
  href: string;
  wikipediaPage: string;
};

// descriptions will be a dictionary-like object where keys are
// numbers(post Ids) and values are strings(post descriptions)
// Record is used when keys and values are of 2 different types
type DescriptionsData = Record<number, string>;

const posts = [
  {
    id: 1,
    title: "God Of War (2018)",
    wikipediaPage: "God_of_War_(2018_video_game)",
    href: "#",
  },
  {
    id: 2,
    title: "Marvel's Spider-Man Remastered",
    wikipediaPage: "Spider-Man_(2018_video_game)",
    href: "#",
  },
  {
    id: 3,
    title: "Alan Wake 2",
    wikipediaPage: "Alan_Wake_2",
    href: "#",
  },
];

const Posts = () => {
  //({}) initializes an empty object
  const [descriptions, setDescriptions] = useState<DescriptionsData>({});
  const [posterUrls, setPosterUrls] = useState<DescriptionsData>({});

  useEffect(() => {
    const fetchData = async () => {
      const descriptionsData: DescriptionsData = {};
      const urls: DescriptionsData = {};

      for (const post of posts) {
        try {
          // Fetch description from Wikipedia
          const response = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${post.wikipediaPage}`
          );

          //takes the response from the wikipedia API and assigns it to
          //each post based on its id
          descriptionsData[post.id] = response.data.extract;

          // Fetch image from RAWG API
          const rawgResponse = await axios.get(
            `https://api.rawg.io/api/games`,
            {
              params: {
                search: post.title,
                key: "f0e283f3b0da46e394e48ae406935d25",
              },
            }
          );

          const imageUrl =
            rawgResponse.data.results.length > 0
              ? rawgResponse.data.results[0].background_image
              : ""; // If no image found, set empty string

          urls[post.id] = imageUrl;
        } catch (error) {
          console.error(`Error fetching data for ${post.title}:`);
          descriptionsData[post.id] = "Description not available.";
          urls[post.id] = ""; // Set empty string if there's an error
        }
      }
      setDescriptions(descriptionsData);
      setPosterUrls(urls);
    };

    fetchData();
  }, []);

  return (
    <ul className="flex my-20 w-full flex-col items-center justify-center gap-12">
      {posts.map((item) =>
        item.href ? (
          <li
            key={item.id}
            className="text-slate-800  text-md w-1/2 hover:scale-110 transition duration-300 ease-in-out"
          >
            <Link
              href={item.href}
              className="flex border border-white rounded-md"
            >
              <div className="h-36 flex flex-row">
                {posterUrls[item.id] && (
                  <img
                    src={posterUrls[item.id]}
                    alt={item.title}
                    className="object-contain w-64"
                  />
                )}
                <div className="overflow-hidden">
                  <span className="indent-11">{descriptions[item.id]}</span>
                </div>
              </div>
            </Link>
          </li>
        ) : null
      )}
    </ul>
  );
};

export default Posts;
