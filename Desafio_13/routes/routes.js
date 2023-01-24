import { Router } from "express";
const router = Router();

// Middleware
import { authRequired } from "../middleware/auth.js";

// Passport
import passport from "passport";
import {
  localSignupStategy,
  localLoginStrategy,
} from "../passport/localAuth.js";

passport.use("/signup", localSignupStategy);
passport.use("/login", localLoginStrategy);

// Homepage
router.get("/home", authRequired, (req, res) => {
  const username = req.session.passport.user;
  res.render("pages/home.ejs", { title: "Listado", username });
});

// Login
router.get("/login", authRequired, (req, res) => {
  res.redirect(`/home`);
});

router.post(
  "/login",
  passport.authenticate(localLoginStrategy, {
    successRedirect: "/home",
    failureRedirect: "/loginError",
    passReqToCallback: true,
  })
);

// Login error
router.get("/loginError", (req, res) => {
  res.render("pages/loginError.ejs");
});

// Logout
router.get("/logout", (req, res) => {
  const username = req.session.passport.user;
  req.session.destroy((err) => {
    if (err) {
      return res.send({ status: "Logout ERROR", body: err });
    } else {
      res.render("pages/logout.ejs", { username });
    }
  });
});

// Signup
router.get("/signup", (req, res) => {
  res.render("pages/signup.ejs");
});

router.post(
  "/signup",
  passport.authenticate(localSignupStategy, {
    successRedirect: "/home",
    failureRedirect: "/signupError",
    passReqToCallback: true,
  })
);

// Signup error
router.get("/signupError", (req, res) => {
  res.render("pages/signupError.ejs");
});

// Products test
router.get("/api/productos-test", async (req, res) => {
  res.render(`pages/test.ejs`, {
    title: "Listado random",
  });
});

// Undefined routes
router.get("*", (req, res) => {
  res.status(404).send("ERROR: Ruta no existente");
});

export { router };
