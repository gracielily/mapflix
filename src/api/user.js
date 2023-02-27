import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, UserArray, UserSpec, UserSpecExtra } from "../models/joi-schemas.js";

export const userApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Retrieves all Mapflix users",
    response: { schema: UserArray, failAction: "log" }
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get User Details",
    notes: "Gets details for a single user.",
    validate: { params: { id: IdSpec }, failAction: "log" },
    response: { schema: UserSpecExtra, failAction: "log" },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create new User",
    notes: "Returns details for created User",
    validate: { payload: UserSpec, failAction: "log" },
    response: { schema: UserSpecExtra, failAction: "log" },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAllUsers();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "Delete all users from Mapflix system.",
  },
};