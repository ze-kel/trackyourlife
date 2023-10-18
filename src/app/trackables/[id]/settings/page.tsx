import { redirect } from "next/navigation";
import getPageSession from "src/helpers/getPageSesion";
import DeleteButton from "@components/DeleteButton";
import TrackableSettings from "@components/TrackableSettings";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { RSAGetTrackable } from "src/app/api/trackables/serverActions";

const Trackable = async ({ params }: { params: { id: string } }) => {
  const session = await getPageSession();

  if (!session) redirect("/login");

  try {
    const trackable = await RSAGetTrackable({
      trackableId: params.id,
      limits: { type: "last", days: 1 },
    });

    return (
      <div className="content-container flex h-full max-h-full w-full flex-col">
        <div className=" mb-4 flex w-full items-center justify-between">
          <h2 className="w-full bg-inherit text-2xl font-semibold">Settings</h2>
          <Link href={`/trackables/${trackable.id}/`} className="mr-2 ">
            <Button variant="outline" size="icon">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteButton id={trackable.id} />
        </div>
        <TrackableSettings trackable={trackable} />
      </div>
    );
  } catch (e) {
    redirect("/");
  }
};

export default Trackable;
