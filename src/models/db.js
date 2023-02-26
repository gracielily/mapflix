import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";

export const db = {
    userStore: null,

    init() {
        this.userStore = userMongoStore;
        connectMongo();
    },
};
