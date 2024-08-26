import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "../../lib/mongo/page";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

interface User {
  username: string;
  email: string;
  password: string;
  verificationToken?: string;
  isVerified?: boolean;
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
      username,
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
      verificationToken,
      isVerified: false,
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

const checkUserExists = async (username: string, email: string) => {
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
    const user = await users.findOne({ verificationToken: token });

    //here will be the logic of redirect
    if (!user) {
      return { status: 400, message: "Invalid token" };
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: { verificationToken: "" },
      }
    );

    return { status: 200, message: "Email verified successfully!" };
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

    if (!user) {
      return { status: 400, message: "User does not exist" };
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return { status: 400, message: "Email is not verified" };
    }

    // Compare the hashed password with the plain-text password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return { status: 400, message: "Username or password is incorrect" };
    }

    return { status: 200, message: "User logged in successfully!" };
  } catch (error) {
    console.error("Error verifying user:", error);
    return { status: 500, message: "Error verifying user" };
  }
};
