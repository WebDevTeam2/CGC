import Games from '@/app/components/Games';
import Movies from '@/app/components/Movies';

export default function Home() {
  return (
      <div className="flex flex-row w-full h-full overflow-hidden parent-container">
        <Games />
        <Movies />
      </div>
  );
}
