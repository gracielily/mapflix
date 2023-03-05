import { Show } from "./show.js";
import { pointMongoStore } from "./point-mongo-store.js";
import { Point } from "./point.js";

export const showMongoStore = {
  async getAll() {
    const shows = await Show.find().lean();
    return shows;
  },

  async getById(id) {
    if (id) {
      const show = await Show.findOne({ _id: id }).lean();
      if (show) {
        show.points = await pointMongoStore.getByShowId(show._id);
      }
      return show;
    }
    return null;
  },

  async create(show) {
    const createdShow = await new Show(show).save();
    return this.getById(createdShow._id);
  },

  async getCreatedByUser(userId) {
    const shows = await Show.find({ userid: id }).lean();
    return shows;
  },

  async delete(id) {
    try {
      // delete associated points 
      await Point.deleteMany({showId: id});  
      await Show.deleteOne({ _id: id });
    } catch (error) {
      console.log("Invalid Show ID");
    }
  },

  async deleteAll() {
    // delete all points then shows
    await Point.deleteMany({})
    await Show.deleteMany({});
  }
};
