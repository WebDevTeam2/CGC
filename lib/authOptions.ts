import { NextAuthOptions } from "next-auth";
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
    async signIn({ user, account }) {
      if (user && account) {
        const email = user.email;

        // Find user by email to check existence
        const existingUser = await findUserByEmail(email || "");

        if (existingUser) {
          // Check if the existing user was created via credentials or another provider
          const isOAuthProvider = existingUser.provider !== "credentials";

          // If the email is linked to a credentials-based account and they try to log in via OAuth
          if (!isOAuthProvider && account.provider !== "credentials") {
            // Log the conflict and prevent sign-in
            return "/signin?error=EmailInUse";
          }

          // Otherwise, allow sign-in (e.g., when logging in with the same OAuth provider)
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
