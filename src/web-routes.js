import { dashboardController } from "./controllers/dashboard.js";

export const webRoutes = [{ method: "GET", path: "/", config: dashboardController.index }];
