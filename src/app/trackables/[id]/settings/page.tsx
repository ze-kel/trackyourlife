import { redirect } from "next/navigation";
import DeleteButton from "@components/DeleteButton";
import TrackableSettings from "@components/TrackableSettings";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  RSAGetTrackable,
  RSAUpdateTrackableSettings,
} from "src/app/api/trackables/serverActions";
import type { ITrackableSettings } from "@t/trackable";
import { validateRequest } from "src/auth/lucia";

const TrackableSettingsPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { session } = await validateRequest();

  if (!session) redirect("/login");

  const trackable = await RSAGetTrackable({
    trackableId: params.id,
    limits: { type: "last", days: 1 },
  });

  const handleSave = async (settings: ITrackableSettings) => {
    "use server";
    await RSAUpdateTrackableSettings({
      trackableId: trackable.id,
      data: settings,
      redirectToTrackablePage: true,
    });
  };

  return (
    <div className="content-container flex h-full max-h-full w-full flex-col pb-6">
      <div className=" mb-4 flex w-full items-center justify-between">
        <h2 className="w-full bg-inherit text-2xl font-semibold">Settings</h2>
        <Link href={`/trackables/${trackable.id}/`} className="mr-2 ">
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </Link>
        <DeleteButton id={trackable.id} />
      </div>
      <TrackableSettings trackable={trackable} handleSave={handleSave} />
    </div>
  );
};

export default TrackableSettingsPage;
