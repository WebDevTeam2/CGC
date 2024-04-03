import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Page: React.FC = () => {
  const router = useRouter();
  const { pageIndex } = router.query;

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/page/${pageIndex}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Page");
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    };
    fetchPage();
  }, [pageIndex]);

  return (
    <>
      <h1>Hello World!</h1>
    </>
  );
};

export default Page;
