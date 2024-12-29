import styles from "../../Games/style.module.css";
import { getScreenshots } from "@/app/Game Collection/functions";

const Screenshots = async ({ params }: { params: any }) => {
  const screenshots = await getScreenshots(params.name);

  return (
    <div className="relative lg:w-[25rem] w-[90vw] lg:h-[45rem] h-auto lg:-translate-y-6 -translate-y-0 flex items-center flex-col gap-2 lg:pr-12 pr-0 lg:pb-0 pb-20">
      <span className="font-bold text-white text-2xl pb-2">Screenshots</span>
      <div
        className={`flex ${styles.scrollbar} items-center overflow-x-auto lg:overflow-auto w-full lg:flex-col min-[480px]:flex-row flex-col gap-[1px] text-balance transition-all duration-200 text-white`}
      >
        {screenshots && screenshots.length > 0 ? (
          screenshots.map((item: any) => (
            <img
              key={item.id}
              alt={`game_screenshot_${item.id}`}
              src={item.image}
              // Make the image display full width
              width={240}
              height={240}
              className="transition-smooth object-cover duration-200 ease-in-out"
            />
          ))
        ) : (
          <span className="text-xl text-white text-center w-64">
            Loading...
          </span>
        )}
      </div>
    </div>
  );
};

export default Screenshots;
