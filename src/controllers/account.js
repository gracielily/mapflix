import { UserBaseSpec, UserSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { getImagePublicId, IMAGE_PAYLOAD } from "./utils.js";

const editUserContextData = {
  pageTitle: "Edit User Details",
  navBreadcrumbs: [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Account Details" }
  ],
  imagePostUrl: "/account/uploadavatar",
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

        return h.view("login", {values: request.payload, errors: error.details}).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.view("login", {values: request.payload, errors: [{ message: "Invalid Credentials" }]}).takeover().code(400);
      }
      request.cookieAuth.set({ id: user._id });
      if (user.isAdmin) {
        return h.redirect("/admin");
      }
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
        const errorContextData = {
          values: request.payload,
          errors: error.details
        }
        return h.view("signup", errorContextData).takeover().code(400);
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
      editUserContextData.values = loggedInUser;
      return h.view("account", editUserContextData);
    },
  },
  saveDetails: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...editUserContextData };
        errorContextData.errors = error.details;
        errorContextData.values = request.payload;
        return h.view("account", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const updatedUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password,
        avatar: loggedInUser.avatar,
      };
      try {
        await db.userStore.update(loggedInUser, updatedUser);
        return h.redirect("/account");
      } catch (error) {
        const errorContextData = { ...editUserContextData };
        errorContextData.errors = [{ message: "Could not update your account details." }];
        return h.view("account", errorContextData);
      }
    },
  },

  uploadAvatar: {
    handler: async function (request, h) {
      try {
        const loggedInUser = request.auth.credentials
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const imgUrl = await imageStore.uploadImage(request.payload.imagefile);
          const updatedUser = { ...loggedInUser }
          updatedUser.avatar = imgUrl;
          await db.userStore.update(loggedInUser, updatedUser);
        }
        return h.redirect("/account");
      } catch (error) {
        const errorContextData = { ...editUserContextData };
        errorContextData.errors = [{ message: "The image could not be uploaded." }];
        return h.view("account", errorContextData);
      }
    },
    payload: IMAGE_PAYLOAD,
  },

  deleteAvatar: {
    handler: async function (request, h) {
      try {
        const loggedInUser = request.auth.credentials
        const avatarUrl = loggedInUser.avatar
        // get image's public id
        const imageId = getImagePublicId(avatarUrl)
        // delete the image from cloudinary
        await imageStore.deleteImage(imageId);
        // update user details
        const updatedUser = { ...loggedInUser }
        updatedUser.avatar = "";
        await db.userStore.update(loggedInUser, updatedUser);
        return h.redirect("/account");
      } catch (error) {
        const errorContextData = { ...editUserContextData };
        errorContextData.errors = [{ message: "The image could not be deleted." }];
        return h.view("account", errorContextData);
      }
    },
  },

  deleteAccount: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials
      try {
        await db.userStore.deleteUserById(loggedInUser._id);
        return h.redirect("/").unstate(process.env.COOKIE_NAME);
      } catch (error) {
        const errorContextData = { ...editUserContextData };
        errorContextData.errors = [{message: "Could not delete account."}];
        return h.view("account", errorContextData).takeover().code(400);
      }
    },
  }
};