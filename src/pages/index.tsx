import Page from "@components/Page";
import TrackablesList from "@components/TrackablesList";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { getAll } from "src/helpers/api";

export default function Home() {
  const { data } = useQuery(["trackables"], getAll);

  return (
    <Page>
      <TrackablesList list={data} />
    </Page>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["trackables"], getAll);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
