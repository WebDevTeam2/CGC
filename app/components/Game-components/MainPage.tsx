import React, { ReactNode } from "react";

interface MainPageProps {
  children: ReactNode;
}

const MainPage: React.FC<MainPageProps> = ({ children }) => {
  return (
    <>
      <div className="overflow-auto h-screen bg-[url('https://wallpapergod.com/images/hd/4k-gaming-4000X2500-wallpaper-33vov45f7zqi6t75.webp')] bg-cover bg-no-repeat bg-center">
        <div className="children min-h-full">{children}</div>
      </div>
    </>
  );
};

export default MainPage;
