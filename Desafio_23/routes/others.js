import Router from "koa-router";
import renderHome from "../Controllers/home.js";
import { info, undefinedRoutes } from "../Controllers/others.js";

const othersRoutes = new Router();

othersRoutes.get("/home", renderHome);
othersRoutes.get("/info", info);
//thersRoutes.get("*", undefinedRoutes);

export default othersRoutes;
