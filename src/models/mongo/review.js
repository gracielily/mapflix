import Mongoose from "mongoose";

const { Schema } = Mongoose;

const reviewSchema = new Schema({
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pointId: {
    type: Schema.Types.ObjectId,
    ref: "Point",
  },
  rating: Number,
  commentTitle: String,
  commentBody: String,
});



export const Review = Mongoose.model("Review", reviewSchema);