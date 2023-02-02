import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModels } from "../models/user.js";
import bCrypt from "bcrypt";

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

export const localSignupStategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    // permite hacer uso de req para manejar datos que vegan por body
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    const user = await userModels.findOne({ email: email });
    const { name } = req.body;

    if (user) {
      return done(null, false);
    } else {
      const newUser = new userModels();
      newUser.name = name;
      newUser.email = email;
      newUser.password = createHash(password);

      await newUser.save();
      // error | data
      console.log("Usuario registrado con exito");
      done(null, newUser);
    }
  }
);

export const localLoginStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    // permite hacer uso de req para manejar datos que vegan por body
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    const user = await userModels.findOne({ email: email });

    if (!user) {
      return done(null, false);
    }

    if (!isValidPassword(user, password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  const user = await userModels.findOne({ email: email });
  done(null, user);
});
