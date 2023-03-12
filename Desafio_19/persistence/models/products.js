import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id_product: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
});

export const productModels = mongoose.model("stock", productSchema);
