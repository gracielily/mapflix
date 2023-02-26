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
    // TODO: Validate data
    handler: async function (request, h) {
      const user = request.payload;
      console.log(user)
      // TODO: Add user to DB
      return h.redirect("/login");
    },
  },
};