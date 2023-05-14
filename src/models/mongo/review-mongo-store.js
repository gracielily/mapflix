import { Review } from "./review.js";
import {pointMongoStore} from "./point-mongo-store.js";
import {userMongoStore} from "./user-mongo-store.js";

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

  async getCreatedByUser(userId) {
    if (userId) {
      const reviews = await Review.find({ userId: userId }).lean();
      return reviews;
    }
    return null;
  },

  async getByPointId(pointId) {
    if (pointId) {
        const reviews = await Review.find({ pointId: pointId }).lean();
        return reviews;
      }
      return null;
  },

  async delete(id) {
    await Review.deleteOne({ _id: id });
  },
  
  async update(currentReview, updatedReview) {
    const review = await this.getById(currentReview._id);
    if (review) {
      await Review.updateOne(
        { _id: currentReview._id },
        {
          commentTitle: updatedReview.commentTitle,
          commentBody: updatedReview.commentBody,
          rating: updatedReview.rating,
        });
    }
  }
};
