import mongoose from "mongoose";

const trackableSchema = new mongoose.Schema({
  type: {
    type: "string",
    required: true,
  },
});
