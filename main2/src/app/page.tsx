import Games from "@/components/Games";
import Movies from "@/components/Movies";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-row w-full h-full overflow-hidden">
      <Games />
      <Movies />  
    </div>
    
    
  );
}
