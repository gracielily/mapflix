import { ShowSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

const contextData = {
  title: "Mapflix Dashboard",
};

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      contextData.user = loggedInUser
      contextData.noShowsMessage = ""
      
      // if search term provided, search for show belonging to user by title
      if(request.query.search){
        const searchTerm = request.query.search
        const filteredShows = await db.showStore.searchByUserAndTitle(loggedInUser._id, searchTerm)
        contextData.shows = filteredShows;
        if(!filteredShows.length) {
          contextData.noShowsMessage = `No Shows found for search term ${searchTerm}. Please try again`
        }
      } else {
        const userShows = await db.showStore.getCreatedByUser(loggedInUser._id);
        for(let i = 0; i < userShows.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          userShows[i].points = await db.pointStore.getByShowId(userShows[i]._id)
        };
        contextData.shows = userShows;
      }
      return h.view("dashboard", contextData);
    },
  },

  createShow: {
    validate: {
      payload: ShowSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = {
          title: request.payload.title,
          imdbId: request.payload.imdbId
        }
        return h.view("dashboard", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const showPayload = {
        userId: loggedInUser._id,
        title: request.payload.title,
        imdbId: request.payload.imdbId,
      };
      await db.showStore.create(showPayload);
      return h.redirect("/dashboard");
    },
  },

  deleteShow: {
    handler: async function (request, h) {
      const showToDelete = await db.showStore.getById(request.params.id);
      try {
      await db.showStore.delete(showToDelete._id);
      return h.redirect("/dashboard");
      } catch(error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error;
        return h.view("dashboard", errorContextData).takeover().code(400);
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
      return h.redirect("/dashboard");
    } catch(error){
      const errorContextData = { ...contextData };
        errorContextData.errors = error;
        return h.view("dashboard", errorContextData).takeover().code(400);
    }
    },
  }
};
