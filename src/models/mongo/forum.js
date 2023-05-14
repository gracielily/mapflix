import Mongoose from "mongoose";

const { Schema } = Mongoose;

const postSchema = new Schema({
  title: String,
  body: String,
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    body: String,
  });



export const Post = Mongoose.model("Post", postSchema);
export const Comment = Mongoose.model("Comment", commentSchema);