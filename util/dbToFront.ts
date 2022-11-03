import {
  ITrackable,
  ITrackableDB,
  ITrackableDBUnsaved,
  ITrackableUnsaved,
} from "@t/trackable";
import { format, parse } from "date-fns";

const transformToUserFormat = ({
  type,
  settings,
  _id,
  data,
}: ITrackableDB): ITrackable => {
  const result: ITrackable = {
    type,
    settings,
    _id,
    data: {},
  };

  data.forEach((el) => {
    result.data[format(el.date, "yyyy-MM-dd")] = el.value;
  });
  return result as ITrackable;
};

const transformToDBFormat = (
  tr: ITrackable | ITrackableUnsaved
): ITrackableDB | ITrackableDBUnsaved => {
  const { type, settings, data } = tr;
  const result = {
    type,
    settings,
    data: Object.values(data).map(({ key, value }) => {
      return {
        date: parse(key, "yyyy-MM-dd", new Date()),
        value,
      };
    }),
  };

  if (tr["_id"]) {
    result["_id"] = tr["_id"];
  }

  return result as ITrackableDB;
};

export { transformToUserFormat, transformToDBFormat };
