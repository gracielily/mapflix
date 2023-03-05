import { connectMongo } from "./mongo/connect.js";
import { pointMongoStore } from "./mongo/point-mongo-store.js";
import { showMongoStore } from "./mongo/show-mongo-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";

export const db = {
    userStore: null,

    init() {
        this.userStore = userMongoStore;
        this.pointStore = pointMongoStore;
        this.showStore = showMongoStore
        connectMongo();
    },
};
