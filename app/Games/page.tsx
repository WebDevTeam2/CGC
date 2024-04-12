import MainPage from "../components/Game-components/MainPage";
import NavBar from "../components/Game-components/NavBar";
import Posts from "../components/Game-components/Posts";
import SearchBar from "../components/Game-components/SearchBar";

interface Post {
  page: number;
  results: PostResult[];
}
interface PostResult {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  description: string;
}

const GamesHomePage = () => {
  return (
    <>
      <MainPage>
        <NavBar />
        <SearchBar />
        <Posts />
      </MainPage>
    </>
  );
};
export default GamesHomePage;
