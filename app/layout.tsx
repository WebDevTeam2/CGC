// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../app/api/uploadthing/core";
const inter = Inter({ subsets: ["latin"] });

interface Author {
  name: string;
  url?: string; // Optional
}

interface Metadata {
  title: string;
  description: string;
  keywords?: string;
  authors: Author[]; // Ensure authors is an array
  robots?: string;
}

export const metadata: Metadata = {
  title: "CineGame Critic - Reviews of Movies & Games",
  description:
    "CineGame Critic provides the latest reviews and ratings for movies and video games. Stay updated with our curated reviews from critics.",
  keywords:
    "movies, games, reviews, articles, information, entertainment, ratings, film critique, video game critique",
  authors: [
    {
      name: "Stefanos Kaloulis",
      url: "www.linkedin.com/in/stefanos-kaloulis-b4ba792b6", // Optional: link to author profile
    },
    {
      name: "Apostolos Kyrgidhs",
      url: "https://www.example.com/apostolos", // Optional: link to author profile
    },
  ],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <head>
          <title>
            {typeof metadata.title === "string"
              ? metadata.title
              : "Default Title"}
          </title>
          <meta
            name="description"
            content={
              typeof metadata.description === "string"
                ? metadata.description
                : "Default description goes here"
            }
          />
          {metadata.authors.map((author, index) => (
            <meta key={index} name="author" content={author.name} />
          ))}
          <meta
            name="robots"
            content={
              typeof metadata.robots === "string"
                ? metadata.robots
                : "index, follow"
            }
          />
          <link
            rel="icon"
            href="/assets/images/site-logo.png"
            type="image/png"
            sizes="32x32"
          />
        </head>
        <body className={inter.className}>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
