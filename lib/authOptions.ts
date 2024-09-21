import { Account, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  addUserOath,
  findUserByEmail,
  logUser,
} from "@/app/collection/connection";
import { ObjectId } from "mongodb";
import { AdapterUser } from "next-auth/adapters";
import { IncomingMessage } from "http";

interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  verificationToken?: string;
  isVerified?: boolean;
  isSignUp?: boolean;
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
          console.log("passwords matched");
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
          }; // Return user object with id as string
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
    async signIn({ user, account }) {
      if (user && account) {
        const email = user.email;

        // Find user by email to check existence
        const existingUser = await findUserByEmail(email || "");

        if (existingUser) {
          // Check if the existing user was created via credentials or another provider
          let isOAuthProvider = false;
          let provider = existingUser.provider || "credentials"; // Default to "credentials" if undefined

          if (["google", "github", "facebook"].includes(provider)) {
            isOAuthProvider = true;
            console.log(isOAuthProvider, provider);
          } else if (provider === "credentials") {
            return "/Signin?error=EmailInUse"; // If trying to sign up, redirect to Signup page with error
          }

          // Allow sign-in if it's OAuth provider
          return true;
        }

        // Create a new user if it does not exist
        await addUserOath({
          email: email ?? "",
          profilePicture: user.image || "", // Set a default or fetch from provider
          isVerified: true, // OAuth users are considered verified
          provider: account.provider, // Track the provider (google, github, credentials, etc.)
        });

        return true; // Allow sign-in
      }

      return false; // Deny sign-in if no user or account is provided
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
  },
};
