import * as util from "util";
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
      contextData.shows = [];
      
      // if search term provided, search for show belonging to user by title
      if(request.query.search){
        const searchTerm = request.query.search
        const filteredShows = await db.showStore.searchByTitle(searchTerm)
        if(!filteredShows.length) {
          contextData.noShowsMessage = `No Shows found for search term ${searchTerm}. Please try again`
        } else {
          for(let i = 0; i < filteredShows.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            filteredShows[i].points = await db.pointStore.getPublicByShowId(filteredShows[i]._id)
          };
          contextData.shows = filteredShows;
          contextData.showsJSON = JSON.stringify(filteredShows)
        }
      } else {
        // get all shows by all users - main dashboard
        const allShows = await db.showStore.getAll();
        for(let i = 0; i < allShows.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          allShows[i].points = await db.pointStore.getPublicByShowId(allShows[i]._id)
        };
        contextData.shows = allShows;
        contextData.showsJSON = JSON.stringify(contextData.shows)
      }
      return h.view("dashboard", contextData);
    },
  },
};
