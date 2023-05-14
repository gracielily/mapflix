import { Post, Comment } from "./forum.js";
import {userMongoStore} from "./user-mongo-store.js";

export const postMongoStore = {
  async getAll() {
    const posts = await Post.find().lean();
    return posts;
  },

  async getById(id) {
    if (id) {
      const post = await Post.findOne({ _id: id }).lean();
      if (post) {
        post.user = await userMongoStore.getUserById(post.userId);
      }
      return post;
    }
    return null;
  },

  async create(post) {
    const createdPost = await new Post(post).save();
    return this.getById(createdPost._id);
  },

  
};

export const commentMongoStore = {

    async getById(id) {
      if (id) {
        const comment = await Comment.findOne({ _id: id }).lean();
        if (comment) {
          comment.user = await userMongoStore.getUserById(comment.userId);
        }
        return comment;
      }
      return null;
    },

    async getAllForPost(postId) {
        if(postId) {
            const comments = await Comment.find({postId: postId}).lean();
            if(comments.length){
                comments.forEach(async (comment) => {
                    comment.user = await userMongoStore.getUserById(comment.userId);
                })
                return comments;
            }
        }
        return null;
    },
  
    async create(comment) {
      const createdPost = await new Comment(comment).save();
      return this.getById(comment._id);
    },
  
    
  };
