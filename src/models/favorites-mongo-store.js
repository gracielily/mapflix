import { Favorites } from "./favorites.js";

export const favoritesMongoStore = {
  async deleteAll(){
    await Favorites.deleteMany({});
  },

  async getOrCreateByUser(userId) {
    if (userId) {
      const favorites = await Favorites.findOne({ userId: userId }).lean();
      if (favorites) {
        return favorites;
      }
      const newFavorites = new Favorites({ userId: userId, points: [] });
      const newFavoritesObj = await newFavorites.save();
      const createdFavorites = await this.getOrCreateByUser(newFavoritesObj.userId);
      return createdFavorites;
    }
    return null;
  },

  async addPointToFavorites(favoritesId, pointId) {
    await Favorites.updateOne({ _id: favoritesId }, { $addToSet: { points: pointId } });
  },

  async removePointFromFavorites(favoritesId, locationToDeleteId) {
    await Favorites.updateOne(
        { _id: favoritesId },
        { $pull: { "points": locationToDeleteId }}
      );
  },

};
