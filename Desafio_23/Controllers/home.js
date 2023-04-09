import { logger } from "../logs/loger.js";

const renderHome = async (ctx) => {
  if (await ctx.isAuthenticated()) {
    const username = ctx.session.passport.user;
    logger.info(`Petición recibida por el servidor. GET - /home`);
    await ctx.render("pages/home.ejs", { title: "Listado", username });
  } else {
    ctx.response.redirect("/login");
  }
};

export default renderHome;
