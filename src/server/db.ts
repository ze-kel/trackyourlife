import {
  ITrackable,
  ITrackableDB,
  ITrackableUnsaved,
  ITrackableUpdate,
} from "@t/trackable";

import {
  transformToDBFormat,
  transformToUserFormat,
} from "../../util/dbToFront";
import TrackableModel from "./models/trackableModel";
import mongoose from "mongoose";
import {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
} from "../../config/config";

const connection: any = { isConnected: false };

const DB_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  const db = await mongoose.connect(DB_URL, {});

  connection.isConnected = db.connections[0].readyState;
}

const getTrackables = async (): Promise<ITrackable[]> => {
  const trackables = await TrackableModel.find();
  const transformed = trackables.map(transformToUserFormat);
  return transformed as ITrackable[];
};

const getIdList = async (): Promise<ITrackable["_id"][]> => {
  const trackables = await TrackableModel.find().select("_id");

  return trackables.map((el) => el._id) as string[];
};

const getTrackable = async (_id: ITrackable["_id"]): Promise<ITrackable> => {
  const item = await TrackableModel.findOne({ _id });
  if (!item) {
    throw "Unable to find trackable with id " + _id;
  }
  return transformToUserFormat(item as ITrackableDB);
};

const addTrackable = async (toSave: ITrackableUnsaved): Promise<ITrackable> => {
  const toDbFormat = transformToDBFormat(toSave);
  const newItem = await TrackableModel.create(toDbFormat);
  return transformToUserFormat(newItem) as ITrackable;
};

const updateValidators = {
  boolean(v: unknown) {
    return typeof v === "boolean";
  },
  number(v: unknown) {
    return typeof v === "number";
  },
  range(v: unknown) {
    return typeof v === "number";
  },
};

const updateTrackable = async ({
  _id,
  day,
  month,
  year,
  value,
}: ITrackableUpdate) => {
  const date = new Date(year, month, day);

  const before = await TrackableModel.findOne({ _id });

  if (!before) throw "Trackable with this ID not found";

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
  dbConnect,
  getTrackable,
  getTrackables,
  addTrackable,
  updateTrackable,
  updateTrackableSettings,
  deleteTrackable,
  getIdList,
};

export default fakeDb;
