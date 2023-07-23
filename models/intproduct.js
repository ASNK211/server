const mongoose = require("mongoose")
const intproductSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        productname: { type: String, required: true },
    },
    { timestamps: true }
)
module.exports = mongoose.model("intproduct", intproductSchema)