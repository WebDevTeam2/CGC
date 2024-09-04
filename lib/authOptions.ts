import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { logUser } from "@/app/collection/connection";
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null if no credentials
        }

        const user = await logUser(credentials.email, credentials.password);

        if (user && user.password === credentials.password) {
          // Replace with hashed password check
          return { id: user._id.toString(), email: user.email }; // Return user object with id as string
        }

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
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
};
