import MainPage from "../components/Game-components/MainPage";
import NavBar from "../components/Game-components/NavBar";
import Posts from "../components/Game-components/Posts";

const GamesHomePage = () => {
  return (
    <>
      <MainPage>
        <NavBar />
        <Posts />
      </MainPage>
    </>
  );
};
export default GamesHomePage;
