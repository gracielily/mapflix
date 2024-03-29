/* eslint-disable no-await-in-loop */
import { ShowSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

let contextData = {
    title: "Admin Dashboard"
};

async function getStats(users) {
    // gets stats per user to be displayed on admin page
    const userStats = []
    for (let i = 0; i < users.length; i+=1) {
        const userShows = await db.showStore.getCreatedByUser(users[i]._id);
        let pointsCount = 0;
        for (let j = 0; j < userShows.length; j+=1) {
            const userPoints = await db.pointStore.getByShowId(userShows[j]._id)
            pointsCount += userPoints.length;
        }
        const userPosts = await db.postStore.getByUserId(users[i]._id);
        userStats.push({
            showCount: userShows.length,
            pointCount: pointsCount,
            shows: userShows,
            postsCount: userPosts.length
        });
    };
    return userStats;
}
export const adminController = {
    index: {
        handler: async function (request, h) {
            const loggedInAdmin = request.auth.credentials;
            // redirect user to dashboard if not admin
            if (!loggedInAdmin.isAdmin) {
                return h.redirect("/dashboard");
            };
            const users = await db.userStore.getAllUsers();
            // display all users except for logged in admin
            const filteredUsers = users
            const allShows = await db.showStore.getAll();
            const allPoints = await db.pointStore.getAll();
            const allPosts = await db.postStore.getAll();
            const userStats = await getStats(filteredUsers);
            contextData = {
                title: "Mapflix Admin",
                user: loggedInAdmin,
                users: filteredUsers,
                shows: allShows,
                points: allPoints,
                posts: allPosts,
                userStats: userStats,
                loggedInAdmin: loggedInAdmin,
            };
            return h.view("admin", contextData);
        },
    },

    toggleUserAdmin: {
        handler: async function (request, h) {
            try {
                // toggles the admin status of the user
                await db.userStore.toggleAdmin(request.params.id);
            } catch (error) {
                const errorContextData = { ...contextData };
                errorContextData.errors = error;
                return h.view("admin", errorContextData).takeover().code(400);
            }
            return h.redirect("/admin");
        },
    },

    deleteUser: {
        handler: async function (request, h) {
            try {
                await db.userStore.deleteUserById(request.params.id);
                return h.redirect("/admin");
            } catch (error) {
                const errorContextData = { ...contextData };
                errorContextData.errors = error;
                return h.view("admin", errorContextData).takeover().code(400);
            }
        },
    },


};
