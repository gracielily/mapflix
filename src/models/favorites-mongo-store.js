import { Favorites } from "./favorites.js";

export const favoritesMongoStore = {
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

  async addPointToFavorites(favorites, pointId) {
    await Favorites.updateOne({ _id: favorites._id }, { $addToSet: { points: pointId } });
  },

  async removePointFromFavorites(favorites, locationToDeleteId) {
    await Favorites.updateOne(
        { _id: favorites._id },
        { $pull: { "points": locationToDeleteId }}
      );
  },

  async deleteAllLocations(favoritesId) {
    // delete all shows and points
    const favorites = await getById(favoritesId);
    if (favorites) {
      await Favorites.updateOne(
        { _id: favorites._id },
        {
          locations: [],
        }
      );
    }
  },
};
