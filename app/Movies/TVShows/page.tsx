import TVShowMain from "@/app/components/Movie-components/TVShowMain";
import ChangeTab from "@/app/components/Movie-components/ChangeTab";

const mainTvShowsPage = async () => {
  return (
    <div>
        <ChangeTab />
        <TVShowMain/>
    </div>
  );
};

export default mainTvShowsPage;
