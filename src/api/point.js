import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PointSpec, PointSpecExtra, PointArraySpec } from "../models/joi-schemas.js";

export const pointApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const points = await db.pointStore.getAll();
        return points;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PointArraySpec },
    description: "Get all Points",
    notes: "Get details for all Points",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const point = await db.pointStore.getById(request.params.id);
        if (!point) {
          return Boom.notFound("No Point found with this ID");
        }
        return point;
      } catch (err) {
        return Boom.serverUnavailable("No Point found with this ID");
      }
    },
    tags: ["api"],
    description: "Find a Point",
    notes: "Returns details about a Point",
    validate: { params: { id: IdSpec } },
    response: { schema: PointSpecExtra },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.create(request.params.id, request.payload);
        if (point) {
          return h.response(point).code(201);
        }
        return Boom.badImplementation("Could not create Point");
      } catch (err) {
        return Boom.serverUnavailable("Could not create Point");
      }
    },
    tags: ["api"],
    description: "Creates a Point",
    notes: "Creates a new Point and returns its details",
    validate: { payload: PointSpec },
    response: { schema: PointSpecExtra },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.pointStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Could not delete all Points");
      }
    },
    tags: ["api"],
    description: "Deletes all Points",
    notes: "Removes a Point",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.getById(request.params.id);
        if (!point) {
          return Boom.notFound("No Point found with this ID");
        }
        await db.pointStore.delete(point._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Point found with this ID");
      }
    },
    tags: ["api"],
    description: "Deletes a Point",
    notes: "Removes a Point",
    validate: { params: { id: IdSpec } },
  },
};
