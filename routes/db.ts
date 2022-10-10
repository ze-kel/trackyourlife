import {
  ITrackable,
  ITrackableDB,
  ITrackableUnsaved,
  ITrackableUpdate,
} from "@t/trackable";

import _merge from "lodash/merge";
import { transformToDBFormat, transformToUserFormat } from "../util/dbToFront";
import { TrackableModel } from "../models/trackableModel";

const getTrackables = async (): Promise<ITrackable[]> => {
  const trackables = await TrackableModel.find();
  const transformed = trackables.map(transformToUserFormat);
  return transformed as ITrackable[];
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

const updateTrackable = async (
  _id: ITrackable["_id"],
  { day, month, year, value }: ITrackableUpdate
) => {
  const date = new Date(year, month, day);
  await TrackableModel.findOneAndUpdate(
    { _id },
    { $push: { data: { date, value } } }
  );

  const item = await TrackableModel.findOne({ _id });

  return transformToUserFormat(item as ITrackableDB);
};

const deleteTrackable = async (_id: ITrackable["_id"]) => {
  await TrackableModel.deleteOne({ _id });
};

const fakeDb = {
  getTrackable,
  getTrackables,
  addTrackable,
  updateTrackable,
  deleteTrackable,
};

export default fakeDb;
