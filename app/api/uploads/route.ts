import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public/uploads")); // Save files in 'public/uploads'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Preserve original file name
  },
});

// Create multer instance with the defined storage
const upload = multer({ storage });

export async function POST(req: NextRequest) {
  return new Promise((resolve, reject) => {
    // Use multer's middleware to handle file upload
    upload.single("file")(req as any, {} as any, (err: any) => {
      if (err) {
        console.error("Error uploading file:", err);
        return resolve(
          NextResponse.json(
            { message: "Error uploading file" },
            { status: 500 }
          )
        );
      }

      const file = (req as any).file;

      if (!file) {
        console.log("No file uploaded");
        return resolve(
          NextResponse.json({ message: "No file uploaded" }, { status: 400 })
        );
      }

      // Return the file path for demonstration purposes
      const filePath = `/uploads/${file.filename}`;
      console.log("File uploaded successfully. File path:", filePath);
      return resolve(NextResponse.json({ filePath }));
    });
  });
}
