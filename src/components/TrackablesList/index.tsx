'use client';
import type { ITrackable } from 'src/types/trackable';
import Link from 'next/link';
import TrackableProvider from 'src/helpers/trackableContext';
import MiniTrackable from './miniTrackable';
import { ReactQueryProvider } from 'src/helpers/ReactQueryProvider';
import { useQuery } from '@tanstack/react-query';
import { getBaseUrl } from 'src/helpers/getBaseUrl';

const getTrackable = async (id: string) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: 'GET',
  });

  const data = (await res.json()) as unknown;

  return data as ITrackable;
};

const Trackable = ({ id }: { id: ITrackable['id'] }) => {
  const { data } = useQuery(['trackable', id], {
    queryFn: async () => {
      return await getTrackable(id);
    },
  });

  if (!data) return <div>Loading</div>;

  return (
    <TrackableProvider trackable={data}>
      <article className="border-b border-neutral-200 py-2 last:border-0 dark:border-neutral-800">
        <Link href={`/trackables/${id}`} className="block w-fit">
          <h3 className="w-fit cursor-pointer text-xl font-light">
            {data.settings.name || 'Unnamed trackable'}
          </h3>
        </Link>
        <MiniTrackable className="my-4" />
      </article>
    </TrackableProvider>
  );
};

const TrackablesList = ({ list }: { list: ITrackable['id'][] }) => {
  if (!list) return <div></div>;

  return (
    <ReactQueryProvider>
      <div className="grid gap-5">
        {list.map((id) => (
          <Trackable id={id} key={id} />
        ))}
      </div>
    </ReactQueryProvider>
  );
};

export default TrackablesList;

/*

*/
