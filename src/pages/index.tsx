import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { getAll, getAllIds, getSingle } from "src/helpers/api";

export default function Home() {
  const { data } = useQuery(["trackables"], getAllIds);

  return (
    <Page>
      <TrackablesList list={data} />
    </Page>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["trackables"], getAllIds);
  const ids = queryClient.getQueryData(["trackables"]) as string[];
  const promises = ids.map((id) => {
    return queryClient.prefetchQuery(
      ["trackable", id],
      async () => await getSingle(id)
    );
  });

  await Promise.all(promises);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
