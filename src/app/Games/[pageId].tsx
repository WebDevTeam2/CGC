import React from "react";
import { useRouter } from "next/router";

const GamePage = () => {
  const router = useRouter();
  const { pageId } = router.query;

  // Fetch game data using pageId

  return (
    <div>
      <h1>Game Details</h1>
      {/* Render game details */}
    </div>
  );
};

export default GamePage;
