const { required } = require("joi");
const mongoose = require("mongoose");

const CompetitionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    balance: { type: Number, required: true , default: 0}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Competition", CompetitionSchema);
