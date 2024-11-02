import Games from "./components/Games";
import Movies from "./components/Movies";
import { authOptions } from "@/authDbConnection/authOptions";
import { getServerSession } from "next-auth";

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex relative lg:flex-row flex-col w-full h-screen overflow-hidden parent-container">
      <Games />
      <Movies />
    </div>
  );
};

export default Home;
