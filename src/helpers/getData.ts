import type { ITrackable, ITrackableUpdate } from "src/types/trackable";

import formatDateKey from "src/helpers/formatDateKey";

const getData = (
  trackable: ITrackable,
  { day, month, year }: Omit<ITrackableUpdate, "value">
): ITrackableUpdate => {
  const nTrackable = trackable;

  if (!trackable.data) {
    nTrackable.data = {};
  }

  const key = formatDateKey({ day, month, year });

  const value = nTrackable.data[key];

  return { day, month, year, value, id: trackable.id };
};

export default getData;
