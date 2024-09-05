import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, findUserByEmail, logUser } from "@/app/collection/connection";
import { ObjectId } from "mongodb";

interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  verificationToken?: string;
  isVerified?: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("No such credentials");
          return null; // Return null if no credentials
        }

        const user = await logUser(credentials.email, credentials.password);

        if (user.status === 200 && user._id) {
          // Replace with hashed password check
          console.log("passwords matched");
          return { id: user._id.toString(), email: user.email }; // Return user object with id as string
        }
        console.log("something went wrong with authorize");
        return null; // Return null if invalid
      },
    }),
  ],
  pages: {
    signIn: "/Signin", // Customize the sign-in page URL if needed
  },
  session: {
    strategy: "jwt", // Use JWT to manage sessions
  },
  callbacks: {
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (user) {
        const email = user.email;
        // const username = user.username;

        // Find user by email to check existence
        const existingUser = await findUserByEmail(email ?? "");

        if (!existingUser) {
          // Create a new user if it does not exist
          await addUser({
            username: "", // Use a default value or handle missing username
            email: email ?? "",
            password: "", // No password for OAuth users
            // profilePicture: "", // Set a default or fetch from provider
            isVerified: true, // OAuth users are considered verified
          });
        }
      }
      return true; // Return true to allow sign-in
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
  },
};
