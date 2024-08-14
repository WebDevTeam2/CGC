import Games from "./components/Games";
import Movies from "./components/Movies";

export default async function Home() {
  return (
    <div className="flex relative lg:flex-row flex-col w-full h-screen overflow-hidden parent-container">
      <Games />
      <Movies />
    </div>
  );
}
