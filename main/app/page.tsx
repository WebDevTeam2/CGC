import Games from "./components/Games";
import Movies from "./components/Movies";

export default function Home() {
  return (
    <div className="flex flex-row">
      <Movies />
      <Games />
    </div>
  );
}
