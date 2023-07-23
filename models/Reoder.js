const mongoose = require("mongoose");

const ReOrdersSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    productId: { type: String , required: true },
    productName: { type: String , required: true },
    productQuanity: { type: String , required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReOrder", ReOrdersSchema);
