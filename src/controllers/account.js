import { UserSpec } from "../models/joi-schemas.js";

export const accountController = {
  displayLogin: {
    handler: function (request, h) {
      return h.view("login", { title: "Login to MapFlix" });
    },
  },
  login: {
    // TODO: Validate user
    handler: async function (request, h) {
      // TODO: set cookie on login
      return h.redirect("/dashboard");
    },
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
      console.log(user)
      // TODO: Add user to DB
      return h.redirect("/login");
    },
  },
};