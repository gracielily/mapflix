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
};