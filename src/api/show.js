import Boom from "@hapi/boom";
import { IdSpec, ShowArraySpec, ShowSpec, ShowSpecExtra, ShowSearchTermSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const showApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        let shows = [];
        // if search query string present, do a search
        // otherwise, get all shows
        if (request.query.search) {
          shows = await db.showStore.searchByTitle(request.query.search)
        } else {
          shows = await db.showStore.getAll();
        }
        return shows;
      } catch (err) {
        console.log(err)
        return Boom.serverUnavailable("No Shows Found");
      }
    },
    tags: ["api"],
    response: { schema: ShowArraySpec },
    description: "Get all shows",
    notes: "Returns all shows",
    validate: {
      query: ShowSearchTermSpec,
    }
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const show = await db.showStore.getById(request.params.id);
        if (!show) {
          return Boom.notFound("No Show found with this ID");
        }
        return show;
      } catch (err) {
        return Boom.serverUnavailable("No Show found with this ID");
      }
    },
    tags: ["api"],
    description: "Find a Show",
    notes: "Returns a Show",
    validate: { params: { id: IdSpec } },
    response: { schema: ShowSpecExtra },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const show = sanitizeData(request.payload);
        const newShow = await db.showStore.create(show);
        if (newShow) {
          return h.response(newShow).code(201);
        }
        return Boom.badImplementation("Could not create Show");
      } catch (err) {
        return Boom.serverUnavailable("Could not create Show");
      }
    },
    tags: ["api"],
    description: "Create a Show",
    notes: "Creates and returns the created show",
    validate: { payload: ShowSpec },
    response: { schema: ShowSpecExtra },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const show = await db.showStore.getById(request.params.id);
        if (!show) {
          return Boom.notFound("No Show found with this ID");
        }
        await db.showStore.delete(show._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Could not delete Show");
      }
    },
    tags: ["api"],
    description: "Delete a Show",
    notes: "Deletes the provided Show",
    validate: { params: { id: IdSpec } },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.showStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Could not delete all Shows");
      }
    },
    tags: ["api"],
    description: "Delete all Shows",
    notes: "Delete every Show"
  },
};
