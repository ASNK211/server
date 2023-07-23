const Card = require("../models/Cards");
const Order = require("../models/Order");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const fs = require("fs")
const router = require("express").Router();
// const multer = require("multer");

router.post("/",verifyTokenAndAdmin, async (req, res) => {
    const { card, productId } = req.body
    //   const kfnvdk = await Card.save()
    try {
        const savedProduct = await Card.findOneAndUpdate({ productId: productId },
            { $addToSet: { card: { $each: card } } }
        )

        // new Order(req.body)
        res.status(200).json({ savedProduct });
    } catch (err) {
        res.status(400).json(err);
    }
})
//get all
router.get("/getadmincard/:id",verifyTokenAndAdmin, async (req, res) => {
    const { cardId } = req.body;
    try {
        const getcard = await Card.find({ productId: req.params.id })
        res.status(200).json({ getcard });
    } catch (err) {
        res.status(400).json(err);

    }
})
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    const id = req.params.id;
    try {
      const result = await Product.findByIdAndDelete(id);
      if (result.image != "") {
        try {
          fs.unlinkSync("./uploads/" + result.image);
        } catch (err) {
          res.status(200).json(err);
        }
      }
      res.status(200).json({ massage: "Product deleted successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  });
  
// router.get("/ttt", async (req, res) => {
//     try {
//         const getcard = await Order.find({ payd: true })
//         let array3 = getcard
//         let array4 = array3.map(a => a.payd);
//         if (array4 === true) {
//             console.log("hxslfv")
//         } else {
//             console.log("1", getcard)
//             let array3 = getcard
//             // let array4 = array3.map(a => a._id);
//             // let array3 = Product.find({ '_id': { $in: array4 } }).exec(async (err, user) => {
        
//             // })
//             const newblance = await User.findByIdAndUpdate(
//                 JSON.parse(array4),
//                 {
//                     done: true
//                 },
//                 { new: true }
//             );
//             console.log(newblance)
//             console.log(getcard.map((a) => a.payd))
//             res.status(200).json({ getcard });
//         }
//     } catch (err) {
//         res.status(400).json(err);

//     }
// })


module.exports = router;
    