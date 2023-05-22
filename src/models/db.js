import { favoritesMongoStore } from "./mongo/favorites-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";
import { pointMongoStore } from "./mongo/point-mongo-store.js";
import { showMongoStore } from "./mongo/show-mongo-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { reviewMongoStore } from "./mongo/review-mongo-store.js";
import { commentMongoStore, postMongoStore } from "./mongo/forum-mongo-store.js";

export const db = {
    userStore: null,

    init() {
        this.userStore = userMongoStore;
        this.pointStore = pointMongoStore;
        this.showStore = showMongoStore;
        this.favoritesStore = favoritesMongoStore;
        this.reviewStore = reviewMongoStore;
        this.postStore = postMongoStore;
        this.commentStore = commentMongoStore;
        connectMongo();
    },
};
