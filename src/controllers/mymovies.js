import { ShowSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { sanitizeData } from "./utils.js";

const contextData = {
  title: "Mapflix Dashboard",
};

export const myMoviesController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      contextData.user = loggedInUser
      contextData.noShowsMessage = ""
      contextData.isMyMovies = true;
      // get all shows by user
      const userShows = await db.showStore.getCreatedByUser(loggedInUser._id);
      for (let i = 0; i < userShows.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        userShows[i].points = await db.pointStore.getByShowId(userShows[i]._id)
      };
      contextData.shows = userShows;
      return h.view("mymovies", contextData);
    },
  },

  createShow: {
    validate: {
      payload: ShowSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        request.payload = sanitizeData(request.payload);
        errorContextData.values = {
          title: request.payload.title,
          imdbId: request.payload.imdbId
        }
        return h.view("mymovies", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      request.payload = sanitizeData(request.payload);
      const showPayload = {
        userId: loggedInUser._id,
        title: request.payload.title,
        imdbId: request.payload.imdbId,
      };
      await db.showStore.create(showPayload);
      return h.redirect("/my-movies");
    },
  },

  deleteShow: {
    handler: async function (request, h) {
      const showToDelete = await db.showStore.getById(request.params.id);
      try {
        await db.showStore.delete(showToDelete._id);
        return h.redirect("/my-movies");
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error;
        return h.view("mymovies", errorContextData).takeover().code(400);
      }
    },
  },

  deleteAllShows: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      try {
        // delete all shows belonging to user
        const userShows = await db.showStore.getCreatedByUser(loggedInUser._id);
        for (let i = 0; i < userShows.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await db.showStore.delete(userShows[i]._id);
        }
        return h.redirect("/my-movies");
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error;
        return h.view("mymovies", errorContextData).takeover().code(400);
      }
    },
  }
};
