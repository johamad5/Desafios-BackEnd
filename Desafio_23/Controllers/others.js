import { logger } from "../logs/loger.js";
import { datosServer } from "../services/others.js";

export const info = async (ctx) => {
  logger.info(`Petición recibida por el servidor. GET - /info`);
  const datos = await datosServer();
  ctx.response.status = 200;
  ctx.body(datos);
};

export const undefinedRoutes = (ctx) => {
  logger.warn();
  `Petición recibida por el servidor. Ruta no definida.`;
  ctx.response.status = 404;
  ctx.body = {
    status: "error",
    message: "This path doesn't exist",
  };
};
