const mongoose = require("mongoose");

const theautoserialSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    productId: { type: String, required: true },
    serial: {
        type: Array,
        default: []
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("theautoserial", theautoserialSchema);