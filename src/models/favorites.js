import Mongoose from "mongoose";

const { Schema } = Mongoose;

const favoritesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  points: [{
    type: Schema.Types.ObjectId,
    ref: "Point",
  }],
});

export const Favorites = Mongoose.model("Favorites", favoritesSchema);