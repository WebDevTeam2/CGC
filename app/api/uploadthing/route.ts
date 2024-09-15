import { createRouteHandler } from "uploadthing/next";

// import { ourFileRouter } from "./core";
import { ourFileRouter } from "./core"; // Path to your file router

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
