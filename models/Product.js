const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    intproductId: {type: String, required: true},
    title: { type: String, required: true},
    image: {
      type: String,required: true
    },
    categories: { type: Array },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
