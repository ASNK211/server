const mongoose = require("mongoose");

const serialSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    serial: { type: String, required: true },
    productName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("serial", serialSchema);
