import React, { ReactNode } from "react";
import Head from "next/head";

interface MainPageProps {
  children: ReactNode;
}

const MainPage: React.FC<MainPageProps> = ({ children }) => {
  return (
    <>
      <Head>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background-color: black; /* Set your desired background color */
          }
        `}</style>
      </Head>
      <div className="container">{children}</div>
    </>
  );
};

export default MainPage;
