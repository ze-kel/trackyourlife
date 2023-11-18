import DeleteButton from "@components/DeleteButton";
import TrackableView from "@components/TrackableView";
import { Button } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import getPageSession from "src/helpers/getPageSesion";
import { RSAGetTrackable } from "src/app/api/trackables/serverActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { ITrackable } from "@t/trackable";

const Trackable = async ({ params }: { params: { id: string } }) => {
  const session = await getPageSession();
  if (!session) redirect("/login");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["trackable", params.id],
    queryFn: async () => {
      return await RSAGetTrackable({ trackableId: params.id });
    },
  });
  const data = queryClient.getQueryData(["trackable", params.id]) as ITrackable;

  try {
    return (
      <div className="content-container flex h-full max-h-full w-full flex-col">
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="w-full bg-inherit text-xl font-semibold md:text-2xl">
            {data.settings.name}
          </h2>
          <Link href={`/trackables/${params.id}/settings`} className="mr-2">
            <Button name="settings" variant="outline" size="icon">
              <GearIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteButton id={params.id} />
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <TrackableView id={params.id} />
        </HydrationBoundary>
      </div>
    );
  } catch (e) {
    redirect("/");
  }
};

export default Trackable;
