import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { api } from "../utils/api";
import CreateButton from "@components/CreateButton";

const AllTrackables = () => {
  const { data } = api.trackable.getAllIds.useQuery();
  const qContext = api.useContext();

  return (
    <div className="content-container overflow-scroll">
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-2xl font-semibold">Your Trackables</h2>
        <CreateButton />
      </div>
      {data && <TrackablesList list={data} />}
    </div>
  );
};

export default function Home() {
  return (
    <Page>
      <AllTrackables />
    </Page>
  );
}
