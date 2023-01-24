import mongoose from "mongoose";
import { mongodb } from "../keys.js";

mongoose.set("useFindAndModify", false);
export function DBconect() {
  mongoose
    .connect(mongodb.URI, mongodb.advanceOptions)
    .then((db) => {
      console.log("Connected to the database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. n${err}`);
    });
}
