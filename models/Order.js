const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    order: {
      type: Array,
      default: []
    },
    orderNumber:{type: String, required: true},
    sun: { type: Number, },
    sunafter: { type: Number, },
    sum: { type: Number, },
    beforebalance: { type: Number, },
    afterbalance: { type: Number, },
    trnumber: { type: String, },
    amount: { type: Number, },
    nameproduct:{ type: String, },
    image: {
      type: String,
    },
    email: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
