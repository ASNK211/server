const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderNumber:{type: String},
    sun: { type: Number, },
    sum: { type: Number, },
    beforebalance: { type: Number, },
    afterbalance: { type: Number, },
    sunafter: { type: Number, },
    order: {
        type: Array,
        default: []
      },
    // price: { type: Number, required: true },
    nameproduct:{ type: String, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);
