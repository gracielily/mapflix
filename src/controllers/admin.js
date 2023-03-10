import { ShowSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

let contextData = {
    pageTitle: "Admin Dashboard"
};

async function getStats(users) {
    const userStats = []
    for (let i = 0; i < users.length; i++) {
        const userShows = await db.showStore.getCreatedByUser(users[i]._id);
        let pointsCount = 0;
        for (let j = 0; j < userShows.length; j++) {
            const userPoints = await db.pointStore.getByShowId(userShows[j]._id)
            pointsCount += userPoints.length;
        }
        userStats.push({
            showCount: userShows.length,
            pointCount: pointsCount,
            shows: userShows,
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
            const filteredUsers = users.filter(user => user._id.equals(loggedInAdmin._id))
            const allShows = await db.showStore.getAll();
            const allPoints = await db.pointStore.getAll();
            const userStats = await getStats(filteredUsers);
            contextData = {
                title: "Mapflix Admin",
                admin: loggedInAdmin,
                users: filteredUsers,
                shows: allShows,
                points: allPoints,
                userStats: userStats
            };
            return h.view("admin", contextData);
        },
    },

    toggleUserAdmin: {
        handler: async function (request, h) {
            try {
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
