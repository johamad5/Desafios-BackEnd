import mongoStore from "koa-session-mongo";
import MongooseStore from "koa-session-mongoose";
import { URImongo } from "./envConfig.js";

export const mongoSession = new MongooseStore({
  store: mongoStore.create({
    mongoUrl: URImongo,
    db: "desafio",
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  }),
  secret: "palabraEncriptadora",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
  },
  rolling: true,
});
