/* eslint-disable no-await-in-loop */
import { PostSpec, CommentSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { sanitizeData } from "./utils.js";

const contextData = {
    title: "Forum",
  };

export const forumController = {
  index: {
    handler: async function (request, h) {
      contextData.values = [];
      contextData.user = request.auth.credentials;
      contextData.postUrl = "/forum/add-post";
      contextData.posts =  await db.postStore.getAll();
      // get comment count for each post
      for(let i = 0; i < contextData.posts.length; i += 1) {
        const comments = await db.commentStore.getAllForPost(contextData.posts[i]._id)
        contextData.posts[i].commentCount = comments ? comments.length : 0;
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
        let val = {...request.payload }
        val = sanitizeData(val);
        errorContextData.values = {...contextData.values, val};
        return h.view("forum", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const postPayload = sanitizeData(request.payload);
      postPayload.userId = request.auth.credentials._id;
      await db.postStore.create(postPayload);
      return h.redirect("/forum");
    },
  },

};


export const postController = {
  index: {
    handler: async function (request, h) {
      contextData.postUrl = `/forum/${request.params.id}/update`
      contextData.commentPostUrl = `/forum/${request.params.id}/add-comment`;
      contextData.post =  await db.postStore.getById(request.params.id);
      contextData.values = contextData.post;
      contextData.post.user = await db.userStore.getUserById(contextData.post.userId);
      contextData.comments = await db.commentStore.getAllForPost(contextData.post._id)
      contextData.loggedInUser = await db.userStore.getUserById(request.auth.credentials._id)
      // check if post belongs to user
      contextData.isUserPost = contextData.loggedInUser._id.toString() === contextData.post.userId.toString();
      return h.view("post", contextData);
    },
  },

  update: {
    validate: {
      payload: PostSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        errorContextData.values = sanitizeData(request.payload);
        return h.view("post", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const post = await db.postStore.getById(request.params.id);
      const updatedPost = {...post};
      request.payload = sanitizeData(request.payload);
      updatedPost.title = request.payload.title;
      updatedPost.body = request.payload.body;
      await db.postStore.update(post, updatedPost);
      return h.redirect(`/forum/${request.params.id}`);
    },
  },

  delete: {
    handler: async function (request, h) {
      const post = await db.postStore.getById(request.params.id);
      try {
        await db.postStore.delete(post._id);
        contextData.values = [];
      } catch(err){
        const errorContextData = { ...contextData };
        errorContextData.errors = [{ message: "The post could not be deleted." }];
        return h.view("post", errorContextData).takeover().code(400);
      }
      return h.redirect("/forum");
    },
  },

  addComment: {
    validate: {
      payload: CommentSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const errorContextData = { ...contextData };
        errorContextData.errors = error.details;
        let val = {...request.payload }
        val = sanitizeData(val);
        errorContextData.values = {...contextData.values, val};
        return h.view("post", errorContextData).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const commentPayload = sanitizeData(request.payload);
      commentPayload.userId = request.auth.credentials._id;
      commentPayload.postId = request.params.id;
      await db.commentStore.create(commentPayload);
      return h.redirect(`/forum/${request.params.id}`);
    },
  },

};

