import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

  async getUserById(id) {
    if (id) {
      const user = await User.findOne({ _id: id }).lean();
      return user;
    }
    return null;
  },

  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const createdUser = await this.getUserById(userObj._id);
    return createdUser;
  },

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    console.log("found ", user)
    return user;
  },

  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("Invalid ID");
    }
  },

  async deleteAllUsers() {
    await User.deleteMany({});
  }
};
