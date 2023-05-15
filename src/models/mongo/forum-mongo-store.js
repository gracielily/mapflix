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

  async delete(id) {
    try {
      // delete associated comments 
      await Comment.deleteMany({ postId: id });
      await Post.deleteOne({ _id: id });
    } catch (error) {
      console.log("Invalid Post ID");
    }
  },

  async update(currentPost, updatedPost) {
    const post = await this.getById(currentPost._id);
    if (post) {
      await Post.updateOne(
        { _id: currentPost._id },
        {
          title: updatedPost.title,
          body: updatedPost.body,
        });
    }
  }

  
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
