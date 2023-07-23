const router = require("express").Router();
const User = require("../models/User");
const ReOrder = require("../models/Reoder");
const Order = require("../models/Order");
// const History = require("../models/History");
const theautoserial = require("../models/theautoserial");
const CryptoJS = require("crypto-js");
const Card = require("../models/Cards");
const jwt = require("jsonwebtoken");
const _ = require('lodash');
// const nodemailer = require('nodemailer');
const { result } = require("lodash");
const Product = require("../models/Product");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");


router.post("/", verifyToken, async (req, res) => {
    const { orders, userId, email } = req.body;
    // let sum = 0;
    // orders.forEach(async order => {
    //     let productId = order.productId;
    //     // console.log("productId",productId)
    //     let Quantity = order.productQuanity;
    //     // console.log("Quantity",Quantity)
    //     let product = await Product.findById(productId);
    //     // console.log("product",product)
    //     if (product) {
    //         sum += (product.price * Quantity)
    //     }
    // });

    // const myAsyncLoopFunction = async (orders) => {
        let sum = 0;
        for (const order of orders) {
            let productId = order.productId;
            let Quantity = order.productQuanity;
            let product = await Product.findById(productId);
            if (product) {
                sum += (product.price * Quantity)
            }
            console.log(`All async tasks complete!`)
        //   const asyncResult = await asyncFunction(item)
        //   allAsyncResults.push(asyncResult)
        }
      
        // return allAsyncResults
    //   }
    // console.log(myAsyncLoopFunction)
    console.log("totalPrice10222",sum)
    if (orders && userId) {
        // console.log("totalPrice2",sum)
        const order = await User.findOne({ _id: JSON.parse(userId) });
        console.log("order.balance", order.balance)
        if (order.balance < sum || sum <= 0 || order.balance == 0) {
            console.log("totalPrice3", sum)
            res.status(500).json({ error: "your balance is not enough" });
        } else {
            console.log("totalPrice4", sum)

            const updatebalance = order.balance - sum
            console.log(updatebalance)
            console.log("updatebalance", updatebalance)
            let ordersn = await User.find();
            let sun = 0;
            for (const value of ordersn) {
                sun += value.balance;
            }
            const updatemonthbalance = Number(order.monthbalance) + Number(sum)
            const updateallbalance = Number(order.allbalance) + Number(sum)
            const monthbalance = await User.findByIdAndUpdate(
                JSON.parse(userId),
                {
                    monthbalance: updatemonthbalance,
                    allbalance: updateallbalance
                },
                { new: true }
            );
            const newblance = await User.findByIdAndUpdate(
                JSON.parse(userId),
                {
                    balance: updatebalance
                },
                { new: true }
            );
            let orderss = await User.find();
            let sunafter = 0;
            for (const value of orderss) {
                sunafter += value.balance;
            }
            // const orderNumbers = await Order.find().count()
            // const newHistory = new History({
            //     userId: userId,
            //     beforebalance: order.balance,
            //     afterbalance: newblance.balance,
            //     sum: sum,
            //     sun: sun,
            //     sunafter: sunafter,
            //     email: email,
            //     order: orders,

            // })
            // newHistory.orderNumber = orderNumbers
            // const savedHistory = await newHistory.save();
            // console.log("savedHistory", savedHistory)
            console.log("newblance", newblance)
            const orderNumber = await Order.find().count()
            const newOrder = new Order({
                userId: userId,
                order: orders,
                email: email,
                beforebalance: order.balance,
                afterbalance: newblance.balance,
                sum: sum,
                sun: sun,
                sunafter: sunafter,
            })
            console.log(newOrder)
            newOrder.orderNumber = orderNumber
            const savedOrder = await newOrder.save();
            console.log(savedOrder)
            if (savedOrder) {
                res.status(200).json({ message: "success", OrderId: savedOrder._id });
            }
            orders.map(async (elment) => {
                const newreOrder = new ReOrder({
                    orderId: savedOrder._id,
                    productId: elment.productId,
                    productName: elment.productName,
                    productQuanity: elment.productQuanity,

                })
                const dddd = await newreOrder.save();
            })
        }
    }
})

router.post("/admin", verifyTokenAndAdmin, async (req, res) => {
    const { orderId } = req.body
    const status = await Order.findOne({ _id: orderId })
    const order = await ReOrder.findOne({ orderId: orderId })
    if (status.status == "Completed") {
        return res.status(404).json("this product is Completed");
        // console.log("this product is Completed")
    } else if (order) {
        return res.status(404).json("this product is used");
        // console.log("this product is used1")
    } else {
        console.log(status)
        console.log(status.order)
        const orders = status.order
        orders.map(async (elment) => {
            const newreOrder = new ReOrder({
                orderId: status._id,
                productId: elment.productId,
                productName: elment.productName,
                productQuanity: elment.productQuanity,

            })
            console.log(newreOrder)
            try {
                const sendorder = await newreOrder.save();
                res.status(200).json(sendorder);
            } catch (err) {
                // res.status(404).send(err);
                // console.log(err)
            }

        })
    }
})
// router.get("/", async (req, res) => {
//    const finde = await ReOrder.findOne()
// //    console.log(finde)
//    const dddd = finde._id.toString();
//    const dddds = finde.productId;
//    const productQuanity = finde.productQuanity
// //    let fgc = await Card.findOne({productId: finde.productId})
//    console.log(dddd.toString())
//    console.log(dddds)
// //    console.log(fgc.card.splice(0,finde.productQuanity))
// //    console.log(fgc)
// //    let frrgc = await Card.updateOne({}, [
// //     {$set: {card: {
// //           $concatArrays: [ 
// //                  {$slice: ["$field", 2]}, 
// //                  {$slice: ["$field", {$add: [1, 2]}, {$size: "$field"}]}
// //           ]
// //     }}}
// // ]);
// // let frrgc = await Card.updateOne([
// //     {
// //       $project:
// //        {
// //           productId: dddds,
// //           first: { $arrayElemAt: [ "$card", 1 ] },
// //        }
// //     }
// //  ])
//     let frrgc = await Card.find({productId: dddds}, {card:{$slice: JSON.parse(productQuanity)}})
//     const rrr = frrgc[0].card
// //     rrr.map((elment) => {
// //         const newreOrder = new theautoserial({
// //             orderId: finde.orderId,
// //             productId: elment,
// //         })
// //     console.log(newreOrder)
// // })
// // rrr.forEach( async (elment) => {
//     const newreOrder = new theautoserial({
//         orderId: finde.orderId,
//         serial: rrr,

//     })
//     let ddddd = await Card.updateOne({productId: dddds}, [
//             {$set: {card: {
//                   $concatArrays: [ 
//                          {$slice: ["$card", {$add: [0, JSON.parse(productQuanity)]}, {$size: "$card"}]}
//                   ]
//             }}}
//         ]);
//         await ReOrder.deleteOne({_id: dddd})
//         console.log("0f0f", finde.productQuanity)
// //  const ddddd = await Card.updateOne({productId: dddds}, { $set: {"card" : 1 }}) 
//  console.log("vvvv", ddddd)
//     console.log("reorder", newreOrder)
//     // console.log("user", user)
//     await newreOrder.save();
//     // consloe.log(gfbgrfb)
//     // })
//     // console.log(frrgc[0].card)
// //    const result = await ReOrder.findByIdAndDelete(dddd);
// //    console.log(result)
// })

module.exports = router;
