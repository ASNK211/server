const router = require("express").Router();
const User = require("../models/User");
const ReOrder = require("../models/Reoder");
const Order = require("../models/Order");
const theautoserial = require("../models/theautoserial");
const CryptoJS = require("crypto-js");
const Card = require("../models/Cards");
const jwt = require("jsonwebtoken");
const _ = require('lodash');
// const nodemailer = require('nodemailer');
const { result } = require("lodash");
const Product = require("../models/Product");
var cron = require('node-cron');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const { findById } = require("../models/User");





cron.schedule('*/1-59 * * * * *', async (req, res) => {
    const finde = await ReOrder.findOne()
    const productQuanity = JSON.parse(finde.productQuanity)
    const dddd = finde._id.toString();
    const productId = finde.productId;
    const frrgc2 = await Card.findOne({ productId: productId })
       if(frrgc2.card.length < productQuanity) {
        //  console.log("not enfgh")
        }
           else if (productQuanity <= 0) {
            const rrr = await ReOrder.deleteOne({ _id: dddd })
            console.log("1",rrr)
            // const frrgc2 = await Card.findOne({ productId: productId })
                }
             
    else if (finde) {
        // console.log("2")
        // get serial from card
        const frrgc = await Card.findOne({ productId: productId }, { card: { $slice: productQuanity } })
        const rrr = frrgc.card;
        const frrgc2 = await Product.findOne({ _id: finde.productId })
        // console.log(frrgc)
        const newreOrder = new theautoserial({
            productId: frrgc2.title,
            orderId: finde.orderId,
            serial: rrr,
        })
        // remove serial from card
        await Card.updateOne({ productId: productId }, [
            {
                $set: {
                    card: {
                        $concatArrays: [
                            { $slice: ["$card", { $add: [0, JSON.parse(productQuanity)] }, { $size: "$card" }] }
                        ]
                    }
                }
            }
        ]);
        //delete the order from reorder after success send
        await ReOrder.deleteOne({ _id: dddd })
        const status = await ReOrder.findOne({orderId: finde.orderId})
        console.log(status)
        if (!status) {
            const newOrder = { status: "Completed" }
            const updatedOrder = await Order.findByIdAndUpdate(
                finde.orderId,
                {
                    $set: newOrder,
                },
                { new: true }
            );
            console.log(updatedOrder)
        }
        await newreOrder.save();
    }
})

router.get("/find/:id", verifyToken, async (req, res) => {
    try {
        const autoserial = await theautoserial.find({ orderId: req.params.id });
        res.status(200).json(autoserial);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
      const reorders = await ReOrder.find();
      res.status(200).json(reorders.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
