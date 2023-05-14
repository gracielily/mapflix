/* eslint-disable no-await-in-loop */
import { PostSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

const contextData = {
    title: "Forum",
  };

export const forumController = {
  index: {
    handler: async function (request, h) {
      contextData.postUrl = "/forum/add-post";
      contextData.posts =  await db.postStore.getAll();
      // get comment count for each post
      for(let i = 0; i < contextData.posts.length; i += 1) {
        const comments = await db.commentStore.getAllForPost(contextData.posts[i]._id)
        contextData.posts[i].commentCount = comments.length ? comments.length : 0;
        contextData.posts[i].user = await db.userStore.getUserById(contextData.posts[i].userId)
      }
      return h.view("forum", contextData);
    },
  },

  addPost: {
    validate: {
      payload: PostSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = {...contextData.values, ...request.payload};
        return h.view("forum", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const postPayload = request.payload;
      const user = request.auth.credentials._id;
      postPayload.userId = user._id
      await db.postStore.create(postPayload);
      return h.redirect("/forum");
    },
  },

};
