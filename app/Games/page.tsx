import MainPage from "../components/Game-components/MainPage";
import NavBar from "../components/Game-components/NavBar";
import Posts from "../components/Game-components/Posts";
import SearchBar from "../components/Game-components/SearchBar";

// urls for the api
// https://api.rawg.io/api/games?key=f0e283f3b0da46e394e48ae406935d25
const basePosterUrl = `https://api.rawg.io/api/games`;
const apiPosterKey = "key=f0e283f3b0da46e394e48ae406935d25";
const apiPosterUrl = basePosterUrl + "?" + apiPosterKey;

// const handleSearch = (postTitle: string) => {
//   const filteredPost = posts.find((post) => post.name === postTitle);
//   // setSpecificPost(filteredPost || null);
// };

interface Props {
  onSearch: (name: string) => void;
}

const GamesHomePage: React.FC<Props> = ({ onSearch }) => {
  return (
    <>
      <MainPage>
        <NavBar />
        <SearchBar onSearch={onSearch} />
        <Posts />
      </MainPage>
    </>
  );
};
export default GamesHomePage;
