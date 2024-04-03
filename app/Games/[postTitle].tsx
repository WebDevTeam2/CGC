import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FetchingDescription from "../FetchingDescription/page";

//getStaticProps & getStaticPaths must coexist in order for dynamic page to work
export const getStaticProps = async () => {
  const res = await fetch("http://localhost:8000/posts");
  const data = await res.json();

  return {
    props: { posts: data },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:8000/posts");
  const data = await res.json();
  const paths = data.map((post: Post) => ({
    params: { postTitle: post.title.replace(/\s+/g, "_") },
  }));

  return {
    paths,
    fallback: false,
  };
};

// Define an interface for the structure of a single post
interface Post {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
}
interface DescriptionItem {
  type: "text" | "image" | "iframe";
  content?: string | React.ReactNode;
}

const Post = () => {
  const router = useRouter();
  let { postTitle } = router.query;
  const { descriptions } = FetchingDescription({ posts: [] });
  let decodedPostTitle: string | undefined;
  const [post, setPost] = useState<Post | null>(null);

  // if (Array.isArray(postTitle)) {
  //   postTitle = postTitle[0];
  // } else {
  //   postTitle = postTitle?.replace(/_/g, " ");
  // }

  // if (typeof postTitle === "string") {
  //   postTitle = postTitle;
  // } else if (Array.isArray(postTitle)) {
  //   postTitle = postTitle[0];
  // } else {
  //   postTitle = undefined;
  // }

  useEffect(() => {
    const fetchPost = async () => {
      if (!postTitle) return; // If postTitle is undefined, do nothing
      const encodedPostTitle = encodeURIComponent(
        Array.isArray(postTitle) ? postTitle[0] : postTitle
      );
      const res = await fetch(
        `http://localhost:8000/posts/${encodedPostTitle}`
      );
      const data = await res.json();
      setPost(data);
    };

    if (postTitle) {
      fetchPost();
    }
  }, [postTitle]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative w-full h-screen">
        <div className="fixed w-full h-screen">
          <Image
            src={post.background}
            alt={post.title + " Background Image"}
            layout="fill"
            objectFit="cover"
          ></Image>
        </div>
        <div className="flex pt-40 pb-5 flex-col items-center justify-center">
          {descriptions[post.id] &&
            splitDescription(
              descriptions[post.id],
              post.inlineImage,
              post.inlineFrame
            ).map((item, index) => (
              <React.Fragment key={index}>
                {item.type === "text" && (
                  <span className="border mt-5 relative 2xl:w-1/2 xl:w-4/6 w-5/6 bg-stone-600/70 p-6 rounded-2xl text-balance text-white text-2xl transition-[width] ease-in-out duration-300">
                    {item.content}
                  </span>
                )}
                {item.type === "image" && typeof item.content === "string" && (
                  <div className="relative h-[30rem] 2xl:w-1/2 xl:w-4/6 w-5/6 mt-5 overflow-hidden transition-[width] ease-in-out duration-300">
                    <Image
                      src={item.content}
                      alt="inline_image"
                      fill={true}
                      objectFit="cover"
                    ></Image>
                  </div>
                )}
                {item.type === "iframe" && typeof item.content === "string" && (
                  <div className="relative h-[58.5vh] mt-5 2xl:w-1/2 xl:w-4/6 w-5/6 flex items-center justify-center transition-[width] ease-in-out duration-300">
                    <iframe
                      src={item.content}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
};

function cutString(str: string): string[] {
  const cutSentence = str
    .split(".")
    .filter((sentence) => sentence.trim() !== "");
  return cutSentence;
}

function splitDescription(
  description: string | undefined,
  inlineImage: string,
  inlineFrame: string
): DescriptionItem[] {
  if (!description) return [];
  const maxSentences = 5; // Adjust this value as needed
  const sentences = cutString(description);
  const result: DescriptionItem[] = [];

  for (let i = 0; i < sentences.length; i += 5) {
    let section = "";
    for (let j = 0; j < 5; j++) {
      if (i + j < sentences.length) {
        section += sentences[i + j] + ".";
      }
    }
    if (i === maxSentences) {
      result.push({
        type: "image",
        content: inlineImage,
      });
    }
    if (i === maxSentences + 5) {
      result.push({
        type: "iframe",
        content: inlineFrame,
      });
    }
    result.push({ type: "text", content: section });
  } //end of for loop

  return result;
} //end of split description function

export default Post;
