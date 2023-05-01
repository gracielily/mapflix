import { showMongoStore } from "./show-mongo-store.js";
import { User } from "./user.js";
import { encryptData, decryptData } from "../encryption.js";

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
    const users =  await User.find().lean()
    const user = users.find((u) => decryptData(u.email) === email)
    return user;
  },

  async deleteUserById(id) {
    try {
      // delete associated shows and points
      const shows = await showMongoStore.getCreatedByUser(id)
      shows.map(async (show) => {
        await showMongoStore.delete(show._id)
      })
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("Invalid ID");
    }
  },

  async deleteAllUsers() {
    // delete all shows and points
    await showMongoStore.deleteAll();
    await User.deleteMany({});
  },

  async update(currentUser, updatedUser) {
    const user = await this.getUserById(currentUser._id);
    if (user) {
      await User.updateOne(
        { _id: currentUser._id },
        {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          password: updatedUser.password,
          avatar: updatedUser.avatar
        });
    }
  },

  async toggleAdmin(currentUserId) {
    const user = await this.getUserById(currentUserId);
    if (user) {
      await User.updateOne(
        { _id: currentUserId },
        {
          isAdmin: !user.isAdmin
        }
      );
    }
  }
};
