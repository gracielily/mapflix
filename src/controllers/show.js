import { PointSpec, ShowSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { getImagePublicId, getMovieData, IMAGE_PAYLOAD } from "./utils.js";

const contextData = {
    pageTitle: "Show Details",
  };

export const showController = {
  index: {
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      contextData.show = show
      contextData.navBreadcrumbs = [
        { title: "Dashboard", link: "/dashboard" },
        { title: show.title},
      ]
      contextData.imagePostUrl = `/show/${show._id}/uploadimage`;
      contextData.showJSON = JSON.stringify(show)
      contextData.user = request.auth.credentials
      contextData.values = show
      contextData.showPostUrl = `/show/${show._id}/update`
      contextData.pointPostUrl = `/show/${show._id}/addpoint`
      const showExtraInfo = await getMovieData(show.imdbId);
      if(showExtraInfo?.success === false) {
        contextData.hideOverview = true;
        contextData.errors = [{message: "could not retrieve movie details"}]
      } else {
        contextData.hideOverview = false;
        contextData.showExtraInfo = showExtraInfo
      }
      return h.view("show", contextData);
    },
  },

  update: {
    validate: {
      payload: ShowSpec,
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
      const updatedShow = {...show};
      updatedShow.title = request.payload.title;
      updatedShow.imdbId = request.payload.imdbId;
      await db.showStore.update(show, updatedShow);
      return h.redirect(`/show/${request.params.id}`);
    },
  },

  addPoint: {
    validate: {
      payload: PointSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = {...contextData.values, ...request.payload};
        return h.view("show", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      const pointPayload = request.payload;
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
