import { accountController } from "./controllers/account.js";
import { dashboardController } from "./controllers/dashboard.js";

export const webRoutes = [
    { method: "GET", path: "/dashboard", config: dashboardController.index },
    { method: "GET", path: "/login", config: accountController.displayLogin },
    { method: "POST", path: "/authenticate", config: accountController.login }
];
