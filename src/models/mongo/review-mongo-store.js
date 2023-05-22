import { Review } from "./review.js";
import { pointMongoStore } from "./point-mongo-store.js";
import { userMongoStore } from "./user-mongo-store.js";

export const reviewMongoStore = {
  async getAll() {
    const reviews = await Review.find().lean();
    return reviews;
  },

  async getById(id) {
    if (id) {
      const review = await Review.findOne({ _id: id }).lean();
      if (review) {
        review.point = await pointMongoStore.getById(review.pointId);
        review.user = await userMongoStore.getUserById(review.userId);
      }
      return review;
    }
    return null;
  },

  async create(review) {
    const createdReview = await new Review(review).save();
    return this.getById(createdReview._id);
  },

  async getByPointId(pointId) {
    if (pointId) {
      const reviews = await Review.find({ pointId: pointId }).lean();
      return reviews;
    }
    return null;
  },

  async delete(id) {
    try {
      await Review.deleteOne({ _id: id });
    } catch (error) {
      console.log("Invalid Review ID");
    }
  },

  async deleteAll() {
    await Review.deleteMany({});
  },
};
