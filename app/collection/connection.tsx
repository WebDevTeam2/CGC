import { Collection, Db, MongoClient, ObjectId, WithId } from "mongodb";
import clientPromise from "../../lib/mongo/page";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

interface Review {
  gameId: number;
  gameName: string;
  reaction: number;
  text: string;
  date: string; // ISO date string
}
interface User {
  username?: string;
  email: string;
  password?: string;
  profilePicture?: string;
  user_reviews?: Review[];
  verificationToken?: string;
  isVerified?: boolean;
  provider?: string;
}

let client: MongoClient | undefined;
let db: Db | undefined;
let users: Collection<User> | undefined;

async function init(): Promise<void> {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    users = await db.collection("users");
  } catch (error) {
    console.error("Error during initialization:", error);
    throw new Error("Failed to establish connection to database");
  }
}

(async () => {
  await init();
})();

export const addUser = async (data: User) => {
  try {
    if (!users) await init();
    if (!users) throw new Error("Users collection is not initialized");

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Destructure username and email from the data
    const { username, email, password } = data;

    // Check if the username or email already exists
    const { usernameExists, emailExists } = await checkUserExists(
      username || "",
      email
    );

    if (usernameExists && emailExists) {
      throw new Error("Username and Email already exist");
    } else if (usernameExists) {
      throw new Error("Username already exists");
    } else if (emailExists) {
      throw new Error("Email already exists");
    }

    // Insert the new user data into the MongoDB collection
    const result = await users.insertOne({
      username,
      email,
      password,
      profilePicture: "",
      user_reviews: [],
      verificationToken,
      isVerified: false,
      provider: "credentials",
    });

    await sendVerificationEmail(email, verificationToken);

    return {
      message:
        "User added successfully. Please check your email for verification.",
      result,
    };
  } catch (error) {
    console.error("Failed to add user:", error);
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    // Re-throw the error in case it's not an instance of Error
    throw error;
  }
};

export const addUserOath = async (data: User) => {
  try {
    if (!users) await init();
    if (!users) throw new Error("Users collection is not initialized");

    // Destructure username and email from the data
    const { username, email } = data;

    // Check if the username or email already exists
    const { usernameExists, emailExists } = await checkUserExists(
      username || "",
      email
    );

    if (usernameExists && emailExists) {
      throw new Error("Username and Email already exist");
    } else if (usernameExists) {
      throw new Error("Username already exists");
    } else if (emailExists) {
      throw new Error("Email already exists");
    }

    // Insert the new user data into the MongoDB collection
    const result = await users.insertOne({
      email,
      profilePicture: data.profilePicture || "",
      user_reviews: [],
      isVerified: true,
      provider: data.provider || "",
    });

    return {
      message: "User added successfully.",
      result,
    };
  } catch (error) {
    console.error("Failed to add user:", error);
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    // Re-throw the error in case it's not an instance of Error
    throw error;
  }
};

const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Only for development; not recommended for production
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #4CAF50;">Verify Your Email Address</h1>
      <p>Please verify your email by clicking on the following link:</p>
      <a href="${verificationUrl}" style="color: #ffffff; background-color: #4CAF50; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not request this email, please ignore it.</p>
    </div>
  `, // HTML content of the email
  };

  await transporter.sendMail(mailOptions);
};

export const checkUserExists = async (username: string, email: string) => {
  if (!users) throw new Error("Users collection is not initialized");
  try {
    const usernameExists = await users.findOne({ username });
    const emailExists = await users.findOne({ email });

    return {
      usernameExists: !!usernameExists,
      emailExists: !!emailExists,
    };
  } catch (error) {
    console.error("Failed to check user existence:", error);
    throw new Error("Failed to check user existence");
  }
};

//this function is being called in the api (signup)
export const verifyUserEmail = async (token: string) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  try {
    console.log("Token received:", token);
    const user = await users.findOne({ verificationToken: token });
    console.log("User found:", user);

    // Find the user by the verification token and update their status to verified
    const updatedUser = await users.findOneAndUpdate(
      { verificationToken: token }, // Find the user with the token
      {
        $set: { isVerified: true }, // Set the user as verified
        $unset: { verificationToken: "" }, // Remove the verification token
      },
      { returnDocument: "after" } // Return the updated document after the update
    );
    //here will be the logic of redirect
    if (!updatedUser) {
      return { status: 400, message: "Invalid token" };
    }

    return {
      status: 200,
      message: "Email verified successfully!",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { status: 500, message: "Error verifying email" };
  }
};

export const logUser = async (email: string, password: string) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  try {
    const user = await users.findOne({ email });
    console.log("logUser worked");
    if (!user) {
      return { status: 400, message: "User does not exist" };
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return { status: 400, message: "Email is not verified" };
    }

    // Compare the hashed password with the plain-text password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || ""
    );
    if (!isPasswordCorrect) {
      return { status: 400, message: "Username or password is incorrect" };
    }

    return {
      status: 200,
      _id: user._id.toString(),
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      password: user.password,
    };
  } catch (error) {
    console.error("Error verifying user:", error);
    return { status: 500, message: "Error verifying user" };
  }
};

export const findUserByEmail = async (email: string) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  return await users.findOne({ email });
};

export const updateUserImage = async (
  email: string,
  profilePicture: string
) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  // Update the user profile with the new profile picture URL
  const result = await users.findOneAndUpdate(
    { email }, // Find user by email
    { $set: { profilePicture } }, // Update the profilePicture field
    { returnDocument: "after" } // Return the updated document
  );

  return result?.profilePicture;
};

// Function to fetch the user's profile picture from the database
export const fetchUserDets = async (email: string) => {
  if (!users) await init(); // Initialize the database if not already done
  if (!users) throw new Error("Users collection is not initialized");

  try {
    const user = await users.findOne({ email });

    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }

    // console.log(user._id);
    return {
      _id: user._id.toString(), // Convert _id to string to avoid BSON issues on the client-side
      profilePicture: user.profilePicture || null, // Return the profile picture or null if not set
    };
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    throw new Error("Failed to fetch profile picture");
  }
};

export const findUserById = async (id: string) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");
  try {
    const objectId = new ObjectId(id);
    const result = await users.findOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw new Error("Failed to fetch user by id");
  }
};

export const updateUserById = async (
  id: string,
  updatedFields: { username?: string; email?: string; password?: string }
) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  try {
    const objectId = new ObjectId(id);
    const result = await users.findOneAndUpdate(
      { _id: objectId },
      { $set: updatedFields }, // Use $set to only update the provided fields
      { returnDocument: "after" } // Return the updated document
    );
    return result;
  } catch (error) {
    console.error("Error updating user by id:", error);
    throw new Error("Failed to update user by id");
  }
};

//Add to watchlist
export const addToWatchlist = async (userId: string, movieId: number) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  try {
    const objectId = new ObjectId(userId);
    const result = await users.findOneAndUpdate(
      { _id: objectId },
      { $addToSet: { watchlist: movieId } }, // Use $addToSet to add the movieId to the watchlist array
      { returnDocument: "after" } // Return the updated document
    );
    return result;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw new Error("Failed to update user by id");
  }
};

export const addUserReview = async (
  userId: string,
  gameId: number,
  gameName: string,
  reaction: number,
  text: string,
  date: Date
) => {
  if (!users) await init();
  if (!users) throw new Error("Users collection is not initialized");

  // Create a new review object
  const newReview: Review = {
    gameId: gameId,
    gameName: gameName,
    reaction: reaction,
    text: text,
    date: new Date(date).toISOString(), // Save as ISO date string
  };
  try {
    const objectId = new ObjectId(userId);
    const result = await users.findOneAndUpdate(
      { _id: objectId },
      { $push: { user_reviews: newReview } },
      { returnDocument: "after" }
    );
    return result;
  } catch (error) {
    console.error("Error adding to reviews:", error);
    throw new Error("Failed to update user by id");
  }
};
