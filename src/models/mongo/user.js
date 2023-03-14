import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: String,
  dateJoined: {
    type: Date,
    default: Date.now,
  }
});

export const User = Mongoose.model("User", userSchema);
