import { PointFormExtended } from "../models/joi-schemas.js";
import { db } from "../models/db.js";


const contextData = {
    pageTitle: "Point Details",
  };


export const pointController = {
  index: {
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      const point = await db.pointStore.getById(request.params.pointId);
      contextData.navBreadcrumbs = [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Show Details", link: `/show/${show.id}` },
        { title: "Point Details" }
      ]
      contextData.show = show;
      contextData.point = point;
      contextData.values = point;
      contextData.values.latitude = point.location.latitude
      contextData.values.longitude = point.location.longitude
      return h.view("point", contextData);
    },
  },

  update: {
    validate: {
      payload: PointFormExtended,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = request.payload
        return h.view("point", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const point = await db.pointStore.getById(request.params.pointId);
      const newPoint = {
        name: request.payload.name,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
      };
      await db.pointStore.update(point, newPoint);
      return h.redirect(`/show/${request.params.id}`);
    },
  },
};
