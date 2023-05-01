import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import Boom from "boom";
import path from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import Bell from "@hapi/bell";
import Cookie from "@hapi/cookie";
import * as dotenv from "dotenv";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import jwt from "hapi-auth-jwt2";
import fs from "fs";
import { validate } from "./api/jwt-utils.js";
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
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

async function init() {
  const server = Hapi.server({
    port: 3000,
    tls: {
      key: fs.readFileSync("keys/private/webserver.key"),
      cert: fs.readFileSync("keys/webserver.crt")
    }
  })
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(Bell);
  await server.register(jwt);
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
    redirectTo: "/",
  });


  server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  const bellConfig = {
    provider: "github",
    password: process.env.GITHUB_ENCRYPTION,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    isSecure: false
  };

  server.auth.strategy("github-oauth", "bell", bellConfig);

  server.auth.default("session");

  Handlebars.registerHelper("ifSameObj", function (a, b, options) {
    if (a.equals(b)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // eslint-disable-next-line prefer-arrow-callback
  Handlebars.registerHelper("toFixed", function (val, places) {
    return val?.toFixed(places)
  });

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
      if (request.response.output.statusCode === 404) {
        const { accept } = request.headers
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
