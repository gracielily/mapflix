import Boom from "boom";

export const homeController = {
    index: {
     auth: false,
      handler: async function (request, h) {;
        const contextData = {
          title: "Mapflix",
        };
        return h.view("home", contextData);
      },
    },
    testErrorLogging: {
      auth:false,
      handler: async function (request, h){
        const error = Boom.internal("Internal Server Error")
        throw error;
      }
    }
};