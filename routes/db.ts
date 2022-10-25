import {
  ITrackable,
  ITrackableDB,
  ITrackableUnsaved,
  ITrackableUpdate,
} from "@t/trackable";

import { transformToDBFormat, transformToUserFormat } from "../util/dbToFront";
import { TrackableModel } from "../models/trackableModel";

const getTrackables = async (): Promise<ITrackable[]> => {
  const trackables = await TrackableModel.find();
  const transformed = trackables.map(transformToUserFormat);
  return transformed as ITrackable[];
};

const getIdList = async (): Promise<ITrackable["_id"][]> => {
  const trackables = await TrackableModel.find().select("_id");
  return trackables.map((el) => el._id);
};

const getTrackable = async (_id: ITrackable["_id"]): Promise<ITrackable> => {
  const item = await TrackableModel.findOne({ _id });
  return transformToUserFormat(item);
};

const addTrackable = async (toSave: ITrackableUnsaved): Promise<ITrackable> => {
  const toDbFormat = transformToDBFormat(toSave);
  const newItem = await TrackableModel.create(toDbFormat);
  return transformToUserFormat(newItem) as ITrackable;
};

const updateValidators = {
  boolean(v) {
    return typeof v === "boolean";
  },
  number(v) {
    return typeof v === "number";
  },
  range(v) {
    return (
      typeof v === "number" &&
      Object.keys(this.settings.labels).includes(String(v))
    );
  },
};

const updateTrackable = async (
  _id: ITrackable["_id"],
  { day, month, year, value }: ITrackableUpdate
) => {
  const date = new Date(year, month, day);

  const before = await TrackableModel.findOne({ _id });

  if (!updateValidators[before.type](value)) {
    throw `Value ${value} is invalid for type ${before.type}`;
  }

  const item = await TrackableModel.findOneAndUpdate(
    { _id },
    { $push: { data: { date, value } } },
    { returnDocument: "after" }
  );

  return transformToUserFormat(item as ITrackableDB);
};

const updateTrackableSettings = async (
  _id: ITrackable["_id"],
  newSettings: ITrackable["settings"]
) => {
  await TrackableModel.findOneAndUpdate(
    { _id },
    { $set: { settings: newSettings } },
    { runValidators: true }
  );

  return newSettings;
};

const deleteTrackable = async (_id: ITrackable["_id"]) => {
  await TrackableModel.deleteOne({ _id });
};

const fakeDb = {
  getTrackable,
  getTrackables,
  addTrackable,
  updateTrackable,
  updateTrackableSettings,
  deleteTrackable,
  getIdList,
};

export default fakeDb;
