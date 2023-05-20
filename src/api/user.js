import Boom from "@hapi/boom";
import { createToken } from "./jwt-utils.js";
import { db } from "../models/db.js";
import { IdSpec, UserArray, UserSpec, UserSpecExtra, UserBaseSpec, JwtAuth, UserSignupSpec } from "../models/joi-schemas.js";
import { sanitizeData } from "../controllers/utils.js";
import DOMPurify from 'isomorphic-dompurify';
import bcrypt from "bcrypt";

export const userApi = {
    authenticate: {
        auth: false,
        handler: async function (request, h) {
            try {
                const user = await db.userStore.getUserByEmail(DOMPurify.sanitize(request.payload.email));
                if (!user) {
                    return Boom.unauthorized("Invalid Credentials");
                }
                const passwordsMatch = await bcrypt.compare(DOMPurify.sanitize(request.payload.password), user.password);
                if (!passwordsMatch) {
                    return Boom.unauthorized("Invalid password");
                }
                const token = createToken(user);
                return h.response({ success: true, token: token }).code(201);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Authenticate",
        notes: "Creates JWT token if user has valid credentials",
        validate: { payload: UserBaseSpec, failAction: "log" },
        response: { schema: JwtAuth, failAction: "log" }
    },
    find: {
        auth: { strategy: "jwt" },
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
        auth: { strategy: "jwt" },
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
                const user = await db.userStore.addUser(sanitizeData(request.payload));
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
        validate: { payload: UserSignupSpec, failAction: "log" },
        response: { schema: UserSpecExtra, failAction: "log" },
    },

    deleteOne: {
        auth: { strategy: "jwt" },
        handler: async function (request, h) {
            try {
                await db.userStore.deleteUserById(request.params.id);
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Delete a user",
        notes: "Deletes one user from the Mapflix system.",
        validate: { params: { id: IdSpec }, failAction: "log" },
    },

    deleteAll: {
        auth: { strategy: "jwt" },
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
