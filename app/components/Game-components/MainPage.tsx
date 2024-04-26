import React, { ReactNode } from "react";

interface MainPageProps {
  children: ReactNode;
}

const MainPage: React.FC<MainPageProps> = ({ children }) => {
  return (
    <>
      <div className="wrapper overflow-auto relative h-screen bg-[url('https://million-wallpapers.ru/wallpapers/4/35/349970156348607/dark-desktop-wallpaper-game-joystick.jpg')] bg-cover bg-no-repeat">
        <div className="children min-h-full">{children}</div>
      </div>
    </>
  );
};

export default MainPage;
