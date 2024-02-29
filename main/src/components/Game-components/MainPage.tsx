import React, { ReactNode } from "react";

interface MainPageProps {
  children: ReactNode;
}

const MainPage: React.FC<MainPageProps> = ({ children }) => {
  return (
    <>
      <div className="wrapper overflow-auto relative h-screen bg-stone-300">
        <div className="children min-h-full">{children}</div>
      </div>
    </>
  );
};

export default MainPage;
