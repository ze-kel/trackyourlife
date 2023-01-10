import { ITrackable, ITrackableUpdate } from "src/types/trackable";

import _cloneDeep from "lodash/cloneDeep";
import formatDateKey from "src/helpers/formatDateKey";

const updateData = (
  trackable: ITrackable,
  { day, month, year, value }: ITrackableUpdate
) => {
  const nTrackable = trackable;

  if (!trackable.data) {
    nTrackable.data = {};
  }

  const key = formatDateKey({ day, month, year });

  nTrackable.data[key] = value;

  return nTrackable;
};

export default updateData;
