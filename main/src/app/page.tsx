import Games from "@/components/Games";
import Movies from "@/components/Movies";

export default function Home() {
  return (
    <div className="flex flex-row w-full h-full overflow-hidden parent-container">
      <Games />
      <Movies />
    </div>
  );
}
