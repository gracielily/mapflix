import Mongoose from "mongoose";

const { Schema } = Mongoose;

const pointSchema = new Schema({
  name: String,
  description: String,
  latitude: Number,
  longitude: Number,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  publicTransport: {
    type: Boolean,
    default: false,
  },
  wheelchairAccessible: {
    type: Boolean,
    default: false,
  },
  facilitiesAvailable: {
    type: Boolean,
    default: false,
  },
  showId: {
    type: Schema.Types.ObjectId,
    ref: "Show",
  },
  images: [String],
});

export const Point = Mongoose.model("Point", pointSchema);