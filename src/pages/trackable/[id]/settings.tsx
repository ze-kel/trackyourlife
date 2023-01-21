import { useRouter } from "next/router";
import Page from "@components/Page";
import TrackableContext from "src/helpers/trackableContext";
import { api } from "../../../utils/api";
import TrackableSettings from "@components/TrackableSettings";

const Trackable = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.trackable.getTrackableById.useQuery(id as string);

  return (
    data && (
      <Page title={data.settings.name} noContainer={true}>
        <TrackableContext trackable={data}>
          <TrackableSettings />
        </TrackableContext>
      </Page>
    )
  );
};

export default Trackable;
