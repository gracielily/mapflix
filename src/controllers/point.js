import { PointSpec, ReviewSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { getImagePublicId, getWeatherData, IMAGE_PAYLOAD } from "./utils.js";

const contextData = {
    title: "Point Details",
  };


export const pointController = {
  index: {
    handler: async function (request, h) {
      const show = await db.showStore.getById(request.params.id);
      const point = await db.pointStore.getById(request.params.pointId);
      contextData.navBreadcrumbs = [
        { title: "Dashboard", link: "/dashboard" },
        { title: show.title, link: `/show/${show._id}` },
        { title: point.name }
      ]
      contextData.show = show;
      contextData.point = point;
      contextData.pointJSON = JSON.stringify(point);
      contextData.postUrl = `/show/${show._id}/point/${point._id}/update`;
      contextData.addReviewUrl = `/show/${show._id}/point/${point._id}/add-review`;
      contextData.user = request.auth.credentials;
      // pre-populate form data
      contextData.values = point;
      contextData.imagePostUrl = `/show/${show._id}/point/${point._id}/uploadimage`;
      const favorites = await db.favoritesStore.getOrCreateByUser(request.auth.credentials._id)
      // check if point in user's favorites
      contextData.inFavorites = favorites.points.find(el => el.toString() === point._id.toString())
      // get weather data
      const weatherData = await getWeatherData(point);
      if(!weatherData?.label) {
        contextData.weather = {error: "No weather data available."}
      } else {
        contextData.weather = weatherData
      }
      // get point reviews
      contextData.reviews = await db.reviewStore.getByPointId(point._id)
      contextData.hasLeftReview = contextData.reviews.find((review) => review.userId.toString() === request.auth.credentials._id.toString())
      for(let i = 0; i < contextData.reviews.length; i+= 1){
        // get user info
        // eslint-disable-next-line no-await-in-loop
        contextData.reviews[i].user = await db.userStore.getUserById(contextData.reviews[i].userId);
        contextData.reviews[i].stars = Array(contextData.reviews[i].rating).fill("star")
      }
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
      return h.redirect(`/show/${request.params.id}/point/${request.params.pointId}`);
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
        return h.view("point", errorContextData);
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
        return h.view("point", errorContextData);
      }
    },
  },

  setCoverImage: {
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        // re-order images
        const updatedPoint = { ...point }
        const {imageIndex} = request.params;
        updatedPoint.images.unshift(updatedPoint.images.splice(imageIndex, 1)[0])
        // update point
        await db.pointStore.update(point, updatedPoint);
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      } catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The cover image could not be set." }];
        return h.view("point", errorContextData);
      }
    },
  },

  toggleVisibility: {
    handler: async function (request, h) {
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        const updatedPoint = { ...point }
        updatedPoint.isPublic = !point.isPublic
        await db.pointStore.update(point, updatedPoint)
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      }
      catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The cover image could not be set." }];
        return h.view("point", errorContextData);
      }
    }
  },

  addToFavorites: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        // add point to favorites
        const favorites = await db.favoritesStore.getOrCreateByUser(loggedInUser._id)
        await db.favoritesStore.addPointToFavorites(favorites, point._id)
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      }
      catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The location could not be added to your favorites." }];
        return h.view("point", errorContextData);
      }
    },
  },

  removeFromFavorites: {
    handler: async function (request, h) {
      const {referrer} = request.info
      try {
        const point = await db.pointStore.getById(request.params.pointId);
        const favorites = await db.favoritesStore.getOrCreateByUser(request.auth.credentials._id);
        // remove point from favorites
        await db.favoritesStore.removePointFromFavorites(favorites, point._id)
        // redirect to the page referred from
        if(referrer.includes("my-favorites")){
          return h.redirect("/my-favorites");
        }
        return h.redirect(`/show/${request.params.id}/point/${point._id}`);
      }
      catch (error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The location could not be removed from your favorites." }];
        // render page referred from
        if(referrer.includes("my-favorites")){
          return h.view("favorites", errorContextData);
        }
        return h.view("point", errorContextData);
      }
    },
  },

  addReview: {
    validate: {
      payload: ReviewSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = {
          rating: request.payload.rating,
          commentTitle: request.payload.commentTitle,
          commentBody: request.payload.commentBody
        }
        return h.view("point", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const point = await db.pointStore.getById(request.params.pointId);
      const reviewPayload = {
        userId: loggedInUser._id,
        pointId: point._id,
        rating: request.payload.rating,
        commentTitle: request.payload.commentTitle,
        commentBody: request.payload.commentBody,
      };
      await db.reviewStore.create(reviewPayload);
      return h.redirect(`/show/${request.params.id}/point/${point._id}`);
    },
  },
};
