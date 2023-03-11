import { PointFormSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { getImagePublicId, IMAGE_PAYLOAD } from "./utils.js";

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
      contextData.imagePostUrl = `/show/${show._id}/uploadimage`;
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

  uploadImage: {
    handler: async function (request, h) {
      try {
        const show = await db.showStore.getById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const imgUrl = await imageStore.uploadImage(request.payload.imagefile);
          const updatedShow = { ...show }
          updatedShow.image = imgUrl;
          await db.showStore.update(show, updatedShow);
        }
        return h.redirect(`/show/${show._id}`);
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The image could not be uploaded." }];
        return h.view("show", errorContextData);
      }
    },
    payload: IMAGE_PAYLOAD,
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        const show = await db.showStore.getById(request.params.id);
        const imageUrl = show.image;
        // get image's public id
        const imageId = getImagePublicId(imageUrl)
        // delete the image from cloudinary
        await imageStore.deleteImage(imageId);
        // update show details
        const updatedShow = { ...show }
        updatedShow.image = "";
        await db.showStore.update(show, updatedShow);
        return h.redirect(`/show/${show._id}`);
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The image could not be deleted." }];
        return h.view("show", errorContextData);
      }
    },
  }

};
