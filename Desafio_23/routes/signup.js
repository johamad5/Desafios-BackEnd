import Router from "koa-router";
import {
  renderSignupForm,
  signupPost,
  renderSignupError,
} from "../Controllers/signup.js";

import passport from "koa-passport";
import { localSignupStategy } from "../passport/localAuth.js";
passport.use("/signup", localSignupStategy);

const signupRoutes = new Router();

signupRoutes.get("/signup", renderSignupForm);
signupRoutes.post(
  "/signup",
  passport.authenticate(localSignupStategy, {
    successRedirect: "/home",
    failureRedirect: "/signupError",
    passReqToCallback: true,
  }),
  signupPost
);
signupRoutes.get("/signupError", renderSignupError);

export default signupRoutes;
