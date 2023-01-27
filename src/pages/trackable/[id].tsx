import { useRouter } from "next/router";
import Page from "@components/Page";
import TrackableView from "@components/TrackableView";
import TrackableContext from "src/helpers/trackableContext";
import { api } from "../../utils/api";
import TrackableName from "@components/TrackableName";
import DeleteButton from "@components/DeleteButton";
import IconSettings from "@heroicons/react/24/outline/Cog6ToothIcon";
import Link from "next/link";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "src/server/api/root";
import { createTRPCContext } from "src/server/api/trpc";
import { getServerAuthSession } from "src/server/auth";
import superjson from "superjson";

const Trackable = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.trackable.getTrackableById.useQuery(id as string);

  return (
    data && (
      <Page title={data.settings.name} noContainer={true}>
        <TrackableContext trackable={data}>
          <div className="content-container flex h-full max-h-full w-full flex-col">
            <div className=" mb-4 flex w-full items-center justify-between">
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

  await ssg.trackable.getTrackableById.prefetch(ctx.query.id as string);

  return {
    props: { session, trpcState: ssg.dehydrate() },
  };
};

export default Trackable;
