import { redirect } from "next/navigation";
import { findAndPrepareTrackable } from "src/app/api/trackables/[id]/route";
import TrackableSub from "./clientPart";
import getPageSession from "src/helpers/getPageSesion";

const Trackable = async ({ params }: { params: { id: string } }) => {
  const session = await getPageSession();

  if (!session) redirect("/login");

  try {
    const trackable = await findAndPrepareTrackable({
      id: params.id,
      userId: session.user.userId,
    });

    return (
      <div>
        <TrackableSub trackable={trackable} />
      </div>
    );
  } catch (e) {
    redirect("/");
  }
};

export default Trackable;
