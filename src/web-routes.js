import { accountController } from "./controllers/account.js";
import { adminController } from "./controllers/admin.js";
import { dashboardController } from "./controllers/dashboard.js";
import { pointController } from "./controllers/point.js";
import { showController } from "./controllers/show.js";
import { homeController } from "./controllers/home.js";
import { portalController } from "./controllers/portal.js";
import { favoritesController } from "./controllers/favorites.js";
import { forumController, postController } from "./controllers/forum.js";

export const webRoutes = [
    { method: "GET", path: "/dashboard", config: dashboardController.index },

    { method: "GET", path: "/my-movies", config: portalController.index },
    { method: "POST", path: "/my-movies/addshow", config: portalController.createShow },
    { method: "GET", path: "/my-movies/deleteshow/{id}", config: portalController.deleteShow },
    { method: "GET", path: "/my-movies/deleteallshows", config: portalController.deleteAllShows },
    { method: "GET", path: "/show/{id}/delete", config: portalController.deleteShow },

    { method: "GET", path: "/my-favorites", config: favoritesController.index },

    { method: "GET", path: "/admin", config: adminController.index },
    { method: "GET", path: "/admin/users/{id}/toggleadmin", config: adminController.toggleUserAdmin },
    { method: "GET", path: "/admin/users/{id}/delete", config: adminController.deleteUser },

    { method: "GET", path: "/login", config: accountController.displayLogin },
    { method: "POST", path: "/authenticate", config: accountController.login },
    { method: "GET", path: "/signup", config: accountController.displaySignup },
    { method: "POST", path: "/register", config: accountController.signup },
    { method: "GET", path: "/logout", config: accountController.logout },
    { method: "GET", path: "/account", config: accountController.edit },
    { method: "POST", path: "/account/savedetails", config: accountController.saveDetails },
    { method: "POST", path: "/account/uploadavatar", config: accountController.uploadAvatar },
    { method: "GET", path: "/account/deleteavatar", config: accountController.deleteAvatar },
    { method: "GET", path: "/account/deleteaccount", config: accountController.deleteAccount },

    { method: "GET", path: "/show/{id}", config: showController.index },
    { method: "POST", path: "/show/{id}/update", config: showController.update },
    { method: "POST", path: "/show/{id}/addpoint", config: showController.addPoint },
    { method: "GET", path: "/show/{id}/deletepoint/{pointId}", config: showController.deletePoint },
    { method: "GET", path: "/show/{id}/togglevisibility/{pointId}", config: pointController.toggleVisibility },
    { method: "GET", path: "/show/{id}/deleteallpoints", config: showController.deleteAllPoints },
    { method: "GET", path: "/show/{id}/point/{pointId}", config: pointController.index },
    { method: "POST", path: "/show/{id}/point/{pointId}/update", config: pointController.update },
    { method: "POST", path: "/show/{id}/uploadimage", config: showController.uploadImage },
    { method: "GET", path: "/show/{id}/deleteimage", config: showController.deleteImage },
    { method: "POST", path: "/show/{id}/point/{pointId}/uploadimage", config: pointController.uploadImage },
    { method: "GET", path: "/show/{id}/point/{pointId}/deleteimage/{imageIndex}", config: pointController.deleteImage },
    { method: "GET", path: "/show/{id}/point/{pointId}/deleteallimages", config: pointController.deleteAllImages },
    { method: "GET", path: "/show/{id}/point/{pointId}/setcoverimage/{imageIndex}", config: pointController.setCoverImage },
    { method: "GET", path: "/show/{id}/point/{pointId}/add-to-favorites", config: pointController.addToFavorites },
    { method: "GET", path: "/show/{id}/point/{pointId}/remove-from-favorites", config: pointController.removeFromFavorites },
    { method: "POST", path: "/show/{id}/point/{pointId}/add-review", config: pointController.addReview },

    { method: "GET", path: "/forum", config: forumController.index },
    { method: "POST", path: "/forum/add-post", config: forumController.addPost },
    { method: "GET", path: "/forum/{id}", config: postController.index },
    { method: "POST", path: "/forum/{id}/add-comment", config: postController.addComment },


    // home page
    { method: "GET", path: "/", config: homeController.index},
    // 404 page
    { method: "GET", path: "/not-found", options: { auth: false, handler: function (request, h) {
        return h.view("404", { title: "Not Found" });
      }} },
    // static file path
    { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];
