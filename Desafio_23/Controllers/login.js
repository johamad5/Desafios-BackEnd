import { logger } from "../logs/loger.js";

export const redirectLogin = (ctx) => {
  logger.info(`Petición recibida por el servidor. GET - /`);

  ctx.response.redirect(`/login`);
};

export const redirectHome = async (ctx) => {
  logger.info(`Petición recibida por el servidor. GET - /login`);

  if (await ctx.isAuthenticated()) {
    ctx.response.redirect(`/home`);
  } else {
    await ctx.render(`pages/login.ejs`);
  }
};

export const renderLoginError = async (ctx) => {
  logger.info(`Petición recibida por el servidor. POST - /login`);

  await ctx.render(`pages/loginError.ejs`);
};

export const logout = async (ctx) => {
  logger.info(`Petición recibida por el servidor. GET - /logout`);

  const username = ctx.session.passport.user;
  req.session.destroy(async (err) => {
    if (err) {
      logger.error(`Logout ERROR: ${err}`);
      ctx.response.status = 404;
      ctx.body = {
        status: "error",
        message: "Logout ERROR",
      };
    } else {
      await ctx.render("pages/logout.ejs", { username });
    }
  });
};

export const loginPost = async (ctx) => {
  logger.info(`Petición recibida por el servidor. POST - /login`);
  const userDetails = ctx.request.body;
  const userId = await user.login(userDetails);
  ctx.session.authenticated = true;
  ctx.session.id = userId;
  ctx.redirect("/");
};
