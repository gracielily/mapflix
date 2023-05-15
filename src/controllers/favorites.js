/* eslint-disable no-await-in-loop */
import { db } from "../models/db.js";

const contextData = {
  title: "Favorite Locations",
};

export const favoritesController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      contextData.user = loggedInUser
      contextData.favoritePoints = [];
        // get user's stored favorite locations
        const favorites = await db.favoritesStore.getOrCreateByUser(loggedInUser._id);
        if (favorites) {
        for(let i = 0; i < favorites.points.length; i += 1) {
          const point = await db.pointStore.getById(favorites.points[i]._id)
          // filter out private points
          if(point && point.isPublic){
          contextData.favoritePoints[i] = point
          contextData.favoritePoints[i].show = await db.showStore.getById(contextData.favoritePoints[i].showId);
          }
        };
    }
      return h.view("favorites", contextData);
    },
  },
};
