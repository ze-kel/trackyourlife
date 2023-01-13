import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { api } from "../utils/api";
import CreateButton from "@components/CreateButton";
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/auth";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createTRPCContext } from "src/server/api/trpc";
import { appRouter } from "src/server/api/root";
import superjson from "superjson";

const AppHome = () => {
  const { data } = api.trackable.getAllIds.useQuery();

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-2xl font-semibold">Your Trackables</h2>
        <CreateButton />
      </div>
      {data ? <TrackablesList list={data} /> : <></>}
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  const ids = await ssg.trackable.getAllIds.fetch();
  const promises: Promise<void>[] = [];
  ids.forEach((id) => {
    promises.push(ssg.trackable.getTrackableById.prefetch(id));
  });
  await Promise.all(promises);

  return {
    props: { session, trpcState: ssg.dehydrate() },
  };
};

export default AppHome;
