
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
};