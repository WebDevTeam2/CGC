import Games from "./Components/Games";
import Movies from "./Components/Movies";

const Home = async () => {
  return (
    <div className="flex relative lg:flex-row flex-col w-full h-screen overflow-hidden parent-container">
      <Games />
      <Movies />
    </div>
  );
};

export default Home;
