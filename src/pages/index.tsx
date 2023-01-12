import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { api } from "../utils/api";
import CreateButton from "@components/CreateButton";

const AllTrackables = () => {
  const { data } = api.trackable.getAllIds.useQuery();

  return (
    <div className="content-container">
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-2xl font-semibold">Your Trackables</h2>
        <CreateButton />
      </div>
      {data && <TrackablesList list={data} />}
    </div>
  );
};

const AppHome = () => {
  return (
    <Page noContainer={true}>
      <AllTrackables />
    </Page>
  );
};

export default AppHome;
