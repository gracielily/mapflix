import { UserBaseSpec, UserSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";


const editUserContextData = {
  pageTitle: "Edit User Details",
  navBreadcrumbs: [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Account Details" }
  ]
};

export const accountController = {
  displayLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login to MapFlix" });
    },
  },
  login: {
    auth: false,
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
  logout: {
    auth: false,
    handler: function (request, h) {
      return h.redirect("/").unstate(process.env.COOKIE_NAME);
    },
  },
  displaySignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Create a Mapflix Account", postUrl: "/register", submitBtnPhrase: "Register" });
    },
  },
  signup: {
    auth: false,
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
  edit: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      editUserContextData.user = loggedInUser;
      editUserContextData.postUrl = "/account/savedetails";
      editUserContextData.submitBtnPhrase = "Save Details";
      return h.view("account", editUserContextData);
    },
  },
  saveDetails: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        return h.view("account", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const updatedUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password
      };
      try {
        await db.userStore.update(loggedInUser, updatedUser);
        return h.redirect("/account");
      } catch (error) {
        const errorContextData = { ...editUserContextData };
        errorContextData.errors = error;
        return h.view("account", errorContextData);
      }
    },
  },
};