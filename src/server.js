import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import Boom from "boom";
import path from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import Cookie from "@hapi/cookie";
import * as dotenv from "dotenv";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import { apiRoutes } from "./api-routes.js";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountController } from "./controllers/account.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const swaggerOptions = {
  info: {
    title: "Mapflix API",
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  server.validator(Joi);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/login",
    validate: accountController.validate,
  });
  server.auth.default("session");
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  db.init("mongo");
  server.route(webRoutes);
  server.route(apiRoutes);
  server.ext("onPreResponse", (request, reply) => {

    if (request.response.isBoom) {
      console.log(request.response)
      console.log(request.response.output.statusCode)
      if (request.response.output.statusCode === 404) {
        const {accept} = request.headers
        if (accept && accept.match(/json/)) {
          return Boom.notFound("Not Found.")
        }
        return reply.redirect("/not-found")
      }
    }
    return reply.continue;
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
