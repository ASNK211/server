const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    card: {
      type: Array,
      default: []
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", CardSchema);
