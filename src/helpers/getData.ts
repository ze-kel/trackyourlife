import type { ITrackable, ITrackableUpdate } from "src/types/trackable";

import formatDateKey from "./formatDateKey";
import type { Optional } from "@t/helpers";

const getData = (
  trackable: ITrackable,
  { day, month, year }: Omit<ITrackableUpdate, "value">,
): Optional<ITrackableUpdate, "value"> => {
  const nTrackable = trackable;

  if (!trackable.data) {
    nTrackable.data = {};
  }

  const key = formatDateKey({ day, month, year });

  const value = nTrackable.data[key];

  return { day, month, year, value, id: trackable.id };
};

export default getData;
