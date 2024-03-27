import TVShowMain from "@/components/Movie-components/TVShowMain";
import ChangeTab from "@/components/Movie-components/ChangeTab";

const mainTvShowsPage = async () => {
  return (
    <div>
        <ChangeTab />
        <TVShowMain/>
    </div>
  );
};

export default mainTvShowsPage;
