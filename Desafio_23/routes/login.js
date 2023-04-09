import Router from "koa-router";
import {
  redirectLogin,
  redirectHome,
  renderLoginError,
  logout,
  loginPost,
} from "../Controllers/login.js";

import passport from "koa-passport";
import { localLoginStrategy } from "../passport/localAuth.js";
passport.use("/login", localLoginStrategy);

const loginRoutes = new Router();

loginRoutes.post(
  "/login",
  passport.authenticate(localLoginStrategy, {
    successRedirect: "/home",
    failureRedirect: "/loginError",
    passReqToCallback: true,
  }),
  loginPost
);
loginRoutes.get("/login", redirectHome);
loginRoutes.get("/loginError", renderLoginError);
loginRoutes.get("/logout", logout);
loginRoutes.get("/", redirectLogin);

export default loginRoutes;
