import Mongoose from "mongoose";

const { Schema } = Mongoose;

const showSchema = new Schema({
  title: String,
  imdbId: String,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  image: String,
});

export const Show = Mongoose.model("Show", showSchema);