import type { ITrackable, ITrackableUpdate } from "src/types/trackable";

import formatDateKey from "./formatDateKey";
import type { Optional } from "@t/helpers";

const updateData = (
  data: ITrackable["data"],
  { day, month, year, value }: Optional<Omit<ITrackableUpdate, "id">, "value">,
) => {
  if (!data) {
    data = {};
  }

  const key = formatDateKey({ day, month, year });

  if (value) {
    data[key] = value;
  } else {
    delete data[key];
  }

  return data;
};

export default updateData;
