import { useQuery, useZero } from "@rocicorp/zero/react";

import { Schema } from "~/schema";

export const useZ = () => {
  return useZero<Schema>();
};

export const useZeroTrackablesList = () => {
  const zero = useZ();
  const q = zero.query.TYL_trackable;
  return useQuery(q);
};

export const useZeroUser = () => {
  const zero = useZ();

  const q = zero.query.TYL_auth_user.one();

  return useQuery(q);
};

export const useZeroTrackable = ({ id }: { id: string }) => {
  const zero = useZ();
  const q = zero.query.TYL_trackable.one().where("id", id);

  return useQuery(q);
};

export const useZeroTrackableData = ({
  id,
  firstDay,
  lastDay,
}: {
  id: string;
  firstDay: Date;
  lastDay: Date;
}) => {
  const zero = useZ();

  const q = zero.query.TYL_trackableRecord.where(({ cmp, and }) =>
    and(
      cmp("trackableId", id),
      cmp("date", ">=", firstDay.getTime()),
      cmp("date", "<=", lastDay.getTime()),
    ),
  );

  return useQuery(q);
};

export const preloadTrackableYear = async ({
  id,
  year,
}: {
  id: string;
  year: number;
}) => {
  const zero = useZ();

  zero.query.TYL_trackableRecord.where("trackableId", id)
    .where("date", ">=", new Date(year - 1, 11, 1).getTime())
    .where("date", "<=", new Date(year + 1, 0, 31).getTime())
    .preload();
};
