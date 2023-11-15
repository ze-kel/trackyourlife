import type { ITrackable, ITrackableUpdate } from "src/types/trackable";

import formatDateKey from "./formatDateKey";
import type { Optional } from "@t/helpers";

const updateData = (
  trackable: ITrackable,
  { day, month, year, value }: Optional<ITrackableUpdate, "value">,
) => {
  const nTrackable = trackable;

  if (!trackable.data) {
    nTrackable.data = {};
  }

  const key = formatDateKey({ day, month, year });

  if (value) {
    nTrackable.data[key] = value;
  } else {
    delete nTrackable.data[key];
  }

  return nTrackable;
};

export default updateData;
