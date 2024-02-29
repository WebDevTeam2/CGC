import MainPage from "@/components/Game-components/MainPage";
import NavBar from "@/components/Game-components/NavBar";
import Posts from "@/components/Game-components/Posts";
import SearchBar from "@/components/Game-components/SearchBar";

export default function GamesHomePage() {
  return (
    <>
      <MainPage>
        <NavBar />
        <Posts />
      </MainPage>
    </>
  );
}
