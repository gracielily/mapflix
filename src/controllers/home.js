
export const homeController = {
    index: {
      handler: async function (request, h) {;
        const contextData = {
          title: "Mapflix",
        };
        return h.view("home", contextData);
      },
    },
};