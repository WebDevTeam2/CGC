import { createRouteHandler } from "uploadthing/next";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// import { ourFileRouter } from "./core";
import { ourFileRouter } from "./core"; // Path to your file router
import type { OurFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
