import { fetchImage } from "@/app/collection/connection";
import { NextApiRequest } from "next";
// import { connectToDatabase } from "@/utils/mongodb"; // A helper function to connect to your MongoDB
// import User from "@/models/User"; // Your Mongoose User model

export async function POST(req: NextApiRequest) {
  try {
    const { email, profilePicture } = req.body;

    // Ensure we have both email and profilePicture from the client
    if (!email || !profilePicture) {
      return Response.json({ message: "Missing email or profile picture URL" });
    }

    const updatedUser = await fetchImage(email, profilePicture);

    if (!updatedUser) {
      return Response.json({ message: "User not found" });
    }

    Response.json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    Response.json({ message: "Internal server error" });
  }
}
