import mongoose, { model, Schema } from "mongoose";
import type { ITrackable, ITrackableDB } from "@t/trackable";

function isBoolean() {
  return this.type === "boolean";
}
function isNumber() {
  return this.type === "number";
}
function isRange() {
  return this.type === "range";
}

const validators = {
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

const trackableSchema = new mongoose.Schema<ITrackableDB>({
  type: {
    type: String,
    enum: ["boolean", "number", "range"],
    required: true,
  },
  settings: {
    name: {
      type: String,
      required: true,
    },
    labels: {
      type: Map,
      required: isRange,
    },
  },
  data: {
    type: [
      {
        value: {
          type: Boolean,
          required: true,
          validate: {
            validator(v) {
              return validators[this.type](v);
            },
            message: "Value validator failed",
          },
        },
        date: { type: Date, required: true },
      },
    ],
    required: true,
  },
});

const TrackableModel = model<ITrackableDB>("Trackable", trackableSchema);

export { TrackableModel };
