<<<<<<< HEAD:src/components/Game-components/MainPage.tsx
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
=======
import React from "react";

const MainPage = () => {
  return <div></div>;
>>>>>>> 4323d54e03e112a88e76609b7505ad553ddd9fae:main/src/components/Game-components/MainPage.tsx
};

export default MainPage;
