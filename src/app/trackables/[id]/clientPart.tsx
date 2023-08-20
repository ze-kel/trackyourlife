'use client';

import DeleteButton from '@components/DeleteButton';
import TrackableName from '@components/TrackableName';
import TrackableView from '@components/TrackableView';
import type { ITrackable } from '@t/trackable';
import Link from 'next/link';
import { ReactQueryProvider } from 'src/helpers/ReactQueryProvider';
import TrackableContext from 'src/helpers/trackableContext';
import IconSettings from '@heroicons/react/24/outline/Cog6ToothIcon';
import { useQuery } from '@tanstack/react-query';
import { getBaseUrl } from 'src/helpers/getBaseUrl';

const getTrackable = async (id: string) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: 'GET',
  });

  const data = (await res.json()) as unknown;

  return data as ITrackable;
};

const Trackable = ({ trackable }: { trackable: ITrackable }) => {
  const { data } = useQuery(['trackable', trackable.id], {
    queryFn: async () => {
      return await getTrackable(trackable.id);
    },
    initialData: trackable,
  });

  return (
    data && (
      <>
        <TrackableContext trackable={data}>
          <div className="content-container flex h-full max-h-full w-full flex-col">
            <div className="mb-4 flex w-full items-center justify-between">
              <TrackableName />
              <Link
                href={`/trackables/${data.id}/settings`}
                className="mr-2 flex w-7 cursor-pointer items-center text-neutral-400 transition-colors hover:text-neutral-700"
              >
                <IconSettings />
              </Link>
              <DeleteButton />
            </div>

            <TrackableView />
          </div>
        </TrackableContext>
      </>
    )
  );
};

const WrappedTrackableClient = ({ data }: { data: ITrackable }) => {
  return (
    <ReactQueryProvider>
      <Trackable trackable={data}></Trackable>
    </ReactQueryProvider>
  );
};

export default WrappedTrackableClient;
