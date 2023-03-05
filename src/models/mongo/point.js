import Mongoose from "mongoose";

const { Schema } = Mongoose;

const pointSchema = new Schema({
  name: String,
  location: {
    latitude: Schema.Types.Decimal128,
    longitude: Schema.Types.Decimal128,
  },
  description: String,
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
});

export const Point = Mongoose.model("Point", pointSchema);