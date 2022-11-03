import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { trpc } from "../utils/trpc";

export default function Home() {
  const { data } = trpc.trackable.getAllIds.useQuery();

  return (
    <Page>
      <div className="content-container overflow-scroll">
        <h2 className="my-4 text-2xl font-semibold">Your Trackables</h2>

        {data && <TrackablesList list={data} />}
      </div>
    </Page>
  );
}
