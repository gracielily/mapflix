import { PointSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { getImagePublicId, IMAGE_PAYLOAD } from "./utils.js";

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
      contextData.user = request.auth.credentials
      console.log("USER", contextData.user)
      // pre-populate form data
      contextData.values = point;
      contextData.imagePostUrl = `/show/${show._id}/point/${point._id}/uploadimage`;
      return h.view("point", contextData);
    },
  },

  update: {
    validate: {
      payload: PointSpec,
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
      const newPoint = request.payload;
      await db.pointStore.update(point, newPoint);
      return h.redirect(`/show/${request.params.id}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const imgUrl = await imageStore.uploadImage(request.payload.imagefile);
          const updatedPoint = { ...point }
          updatedPoint.images.push(imgUrl);
          await db.pointStore.update(point, updatedPoint);
        }
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The image could not be uploaded." }];
        return h.view("point", errorContextData);
      }
    },
    payload: IMAGE_PAYLOAD,
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        const {imageIndex} = request.params;
        const imageToDeleteUrl = point.images[imageIndex];
        // get image's public id
        const imageId = getImagePublicId(imageToDeleteUrl)
        // delete the image from cloudinary
        await imageStore.deleteImage(imageId);
        // update image details
        const updatedPoint = { ...point }
        updatedPoint.images.splice(imageIndex, 1);
        await db.pointStore.update(point, updatedPoint);
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The image could not be deleted." }];
        return h.view("show", errorContextData);
      }
    },
  },
  deleteAllImages: {
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        for(let i = 0; i < point.images.length; i+= 1){
          // get image's public id
          const imageId = getImagePublicId(point.images[i]);
          // delete the image from cloudinary
          /* eslint-disable no-await-in-loop */
          await imageStore.deleteImage(imageId);
        }
        // update image details
        const updatedPoint = { ...point }
        updatedPoint.images = [];
        await db.pointStore.update(point, updatedPoint);
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The images could not be deleted." }];
        return h.view("show", errorContextData);
      }
    },
  }
};
