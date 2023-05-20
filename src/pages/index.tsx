import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { api } from "../utils/api";
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/auth";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createTRPCContext } from "src/server/api/trpc";
import { appRouter } from "src/server/api/root";
import superjson from "superjson";
import Link from "next/link";
import PlusIcon from "@heroicons/react/24/outline/PlusCircleIcon";

const AppHome = () => {
  const { data } = api.trackable.getIds.useQuery();

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Trackables</h2>
        <Link href={"/create"}>
          <PlusIcon
            className={
              "w-7 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-700"
            }
          />
        </Link>
      </div>
      {data ? <TrackablesList list={data} /> : <></>}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  await ssg.user.getUserSettings.fetch();

  const ids = await ssg.trackable.getIds.fetch();

  const data = await ssg.trackable.getTrackablesByIds.fetch(ids);

  data.forEach((trackable) => {
    ssg.queryClient.setQueryData(
      [
        ["trackable", "getTrackableById"],
        {
          input: trackable.id,
          type: "query",
        },
      ],
      trackable
    );
  });

  return {
    props: { session, trpcState: ssg.dehydrate() },
  };
};

export default AppHome;
