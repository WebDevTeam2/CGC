import MainPage from "../components/Game-components/MainPage";
import NavBar from "../components/Game-components/NavBar";
import Posts from "../components/Game-components/Posts";
import SearchBar from "../components/Game-components/SearchBar";

const handleSearch = (postTitle: string) => {
  const filteredPost = posts.find((post) => post.name === postTitle);
  // setSpecificPost(filteredPost || null);
};

interface Props {
  onSearch: (name: string) => void;
}

const GamesHomePage: React.FC<Props> = ({ onSearch }) => {
  return (
    <>
      <MainPage>
        <NavBar />
        <SearchBar onSearch={handleSearch} />
        <Posts />
      </MainPage>
    </>
  );
};
export default GamesHomePage;
