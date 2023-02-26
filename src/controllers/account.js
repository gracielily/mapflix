import { UserBaseSpec, UserSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const accountController = {
  displayLogin: {
    handler: function (request, h) {
      return h.view("login", { title: "Login to MapFlix" });
    },
  },
  login: {
    validate: {
      payload: UserBaseSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login", { title: "Login Error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.view("login", { title: "Login Error", errors: [{message: "Invalid Credentials"}]}).takeover().code(400);
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
  displaySignup: {
    handler: function (request, h) {
      return h.view("signup", { title: "Create a Mapflix Account" });
    },
  },
  signup: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup", { title: "Registration Error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/login");
    },
  },
};