"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

//JS library to handle HTTP requests,enabling the application
//to retrieve data from external sources(API's)
import axios from "axios";
import SearchBar from "./SearchBar";

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
  {
    id: 4,
    title: "Cyberpunk 2077",
    wikipediaPage: "Cyberpunk_2077",
    href: "#",
  },
  {
    id: 5,
    title: "Ratchet & Clank: Rift Apart",
    wikipediaPage: "Ratchet_%26_Clank:_Rift_Apart",
    href: "#",
  },
  {
    id: 6,
    title: "Star Wars: Jedi Survivor",
    wikipediaPage: "Star_Wars_Jedi:_Survivor",
    href: "#",
  },
  {
    id: 7,
    title: "The Last Of Us Part 2",
    wikipediaPage: "The_Last_of_Us_Part_II",
    href: "#",
  },
  {
    id: 8,
    title: "Elden Ring",
    wikipediaPage: "Elden_Ring",
    href: "#",
  },
  {
    id: 9,
    title: "Final Fantasy VII Remake",
    wikipediaPage: "Final_Fantasy_VII_Remake",
    href: "#",
  },
  {
    id: 10,
    title: "Red Dead Redemption 2",
    wikipediaPage: "Red_Dead_Redemption_2",
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
    <>
      <SearchBar posts={posts} />
      <ul className=" flex my-36 w-full flex-col items-center justify-center gap-12">
        {posts.map((item) =>
          item.href ? (
            <li
              key={item.id}
              className="text-slate-800 text-balance text-md xl:w-1/2 lg:w-3/5 w-4/5 hover:scale-110 transition-all duration-500 ease-in-out"
              // style={{ animation: "upandown 2s infinite" }}
            >
              <Link
                href={item.href}
                className="relative flex group border-4 xl:h-52  border-white rounded-lg transition-all duration-300"
              >
                <div className="bg-white relative flex flex-col xl:flex-row gap-5 transition-all duration-400">
                  {posterUrls[item.id] && (
                    <img
                      src={posterUrls[item.id]}
                      alt={item.title}
                      className="object-cover xl:border-r-8 xl:border-double border-white  transition duration-500 ease-in-out"
                    />
                  )}
                  <div
                    className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 items-center justify-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                    style={{
                      transition:
                        "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                    }}
                  >
                    <span className="text-white">{item.title}</span>
                  </div>
                  <div className="overflow-hidden pl-4 leading-7">
                    <span>{descriptions[item.id]}</span>
                  </div>
                </div>
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </>
  );
};

export default Posts;
