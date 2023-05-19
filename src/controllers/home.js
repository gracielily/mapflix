import * as  dotenv from "dotenv";
import { seed } from "../models/mongo/connect.js";

dotenv.config();

export const homeController = {
    index: {
     auth: false,
      handler: async function (request, h) {
        const contextData = {
          title: "Mapflix",
        };
        return h.view("home", contextData);
      },
    },

    resetDb: {
      auth: false,
       handler: async function (request, h) {
        if (process.env.NODE_ENV === "dev"){
        await seed();
        return h.redirect("/");
        } 
          return Boom.notFound("Page could not be found")
       },
     },
};