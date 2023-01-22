import { useRouter } from "next/router";
import Page from "@components/Page";
import TrackableView from "@components/TrackableView";
import TrackableContext from "src/helpers/trackableContext";
import { api } from "../../utils/api";
import TrackableName from "@components/TrackableName";
import DeleteButton from "@components/DeleteButton";
import IconSettings from "@heroicons/react/24/outline/Cog6ToothIcon";
import Link from "next/link";

const Trackable = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.trackable.getTrackableById.useQuery(id as string);

  return (
    data && (
      <Page title={data.settings.name} noContainer={true}>
        <TrackableContext trackable={data}>
          <div className="content-container flex h-full max-h-full w-full flex-col">
            <div className=" flex w-full items-center justify-between py-4">
              <TrackableName />
              <Link
                href={`/trackable/${id as string}/settings`}
                className="mr-2 flex h-full w-6 cursor-pointer items-center text-neutral-400 transition-colors hover:text-neutral-700"
              >
                <IconSettings />
              </Link>
              <DeleteButton />
            </div>

            <TrackableView />
          </div>
        </TrackableContext>
      </Page>
    )
  );
};

export default Trackable;
