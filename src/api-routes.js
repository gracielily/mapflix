import { userApi } from "./api/user.js";
import { showApi } from "./api/show.js";

export const apiRoutes = [
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "GET", path: "/api/shows", config: showApi.find },
  { method: "GET", path: "/api/shows/{id}", config: showApi.findOne },
  { method: "POST", path: "/api/shows", config: showApi.create },
  { method: "DELETE", path: "/api/shows/{id}", config: showApi.deleteOne },
  { method: "DELETE", path: "/api/shows", config: showApi.deleteAll }
];
