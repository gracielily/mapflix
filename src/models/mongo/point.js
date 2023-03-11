import Mongoose from "mongoose";

const { Schema } = Mongoose;

const pointSchema = new Schema({
  name: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  features : {
    publicTransport: Boolean,
    wheelchairAccessible: Boolean,
    facilitiesAvailable: Boolean,
  },
  showId: {
    type: Schema.Types.ObjectId,
    ref: "Show",
  },
  images: [String],
});

export const Point = Mongoose.model("Point", pointSchema);