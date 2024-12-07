import { createRouteHandler } from "uploadthing/next";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// import { ourFileRouter } from "./core";
import { ourFileRouter } from "./core";
import type { OurFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
