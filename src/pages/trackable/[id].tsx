import { useRouter } from "next/router";
import Page from "@components/Page";
import TrackableView from "@components/TrackableView";
import TrackableContext from "src/helpers/trackableContext";
import { trpc } from "../../utils/trpc";

const Trackable = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = trpc.trackable.getTrackableById.useQuery(id as string);

  return (
    data && (
      <Page title={data.settings.name}>
        <TrackableContext trackable={data}>
          <TrackableView />
        </TrackableContext>
      </Page>
    )
  );
};

export default Trackable;
