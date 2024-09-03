import { authOptions } from "@/lib/authOptions";
import nextAuth from "next-auth/next";
const handler = nextAuth(authOptions); 

export { handler as GET, handler as POST };