import { PointFormSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

const contextData = {
    pageTitle: "Show Details",
    navBreadcrumbs: [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Show Details" }
    ]
  };

export const showController = {
  index: {
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      contextData.show = show
      contextData.showJSON = JSON.stringify(show)
      return h.view("show", contextData);
    },
  },

  addPoint: {
    validate: {
      payload: PointFormSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = request.payload
        return h.view("show", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      const pointPayload = {
        name: request.payload.name,
        location: {
            latitude: request.payload.latitude,
            longitude: request.payload.longitude,
        }
      };
      await db.pointStore.create(show._id, pointPayload);
      return h.redirect(`/show/${show._id}`);
    },
  },

  deletePoint: {
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      await db.pointStore.delete(request.params.pointId);
      return h.redirect(`/show/${show._id}`);
    },
  },

  deleteAllPoints: {
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      await db.pointStore.deleteAll(request.params.pointId);
      return h.redirect(`/show/${show._id}`);
    },
  },
};
