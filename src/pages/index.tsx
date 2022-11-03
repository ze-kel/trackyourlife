import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";

export default function Home() {
  const { data } = trpc.trackable.getAllIds.useQuery();
  const qContext = trpc.useContext();

  useEffect(() => {
    data?.forEach((id) => {
      qContext.trackable.getTrackableById.prefetch(id);
    });
  }, []);

  return (
    <Page>
      <div className="content-container overflow-scroll">
        <h2 className="my-4 text-2xl font-semibold">Your Trackables</h2>

        {data && <TrackablesList list={data} />}
      </div>
    </Page>
  );
}
