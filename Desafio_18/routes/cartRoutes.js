import { Router } from "express";
import { authRequired } from "../middleware/auth.js";

const cRoutes = Router();

cRoutes.get("/test", (req, res) => {
  res.send("Hola");
});

export { cRoutes };
