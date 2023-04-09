import Router from "koa-router";
import {
  getAll,
  getOneById,
  save,
  updateById,
  deleteById,
} from "../Controllers/prods.js";

const productRoutes = new Router({ prefix: "/products" });

productRoutes.get("/", getAll);
productRoutes.get("/:id", getOneById);
productRoutes.post("/", save);
productRoutes.patch("/:id", updateById);
productRoutes.delete("/:id", deleteById);

export default productRoutes;
