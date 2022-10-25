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
          type: Schema.Types.Mixed,
          required: true,
        },
        date: { type: Date, required: true },
      },
    ],
    required: true,
  },
});

const TrackableModel = model<ITrackableDB>("Trackable", trackableSchema);

export { TrackableModel };
