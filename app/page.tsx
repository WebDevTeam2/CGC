import Games from "./components/Games";
import Movies from "./components/Movies";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {

  const session = await getServerSession(authOptions);

  return (
    <div className="flex relative lg:flex-row flex-col w-full h-screen overflow-hidden parent-container">
      {
        session ? (
          <div className="absolute top-0 right-0">
            <p>Logged in as {session.user?.email}</p>
          </div>
        ) : (
          <div className="absolute top-0 right-0">
            <p>Welcome Guest</p>
          </div>
        )
      }
      <Games />
      <Movies />
    </div>
  );
}
