import MainPage from "../components/Game-components/MainPage";
import NavBar from "../components/Game-components/NavBar";
import Posts from "../components/Game-components/Posts";
import SearchBar from "../components/Game-components/SearchBar";

// const handleSearch = (postTitle: string) => {
//   const filteredPost = posts.find((post) => post.name === postTitle);
//   // setSpecificPost(filteredPost || null);
// };

// interface Props {
//   onSearch: (name: string) => void;
// }

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
