const { find } = require("lodash");
const Competition = require("../models/Competition");
const User = require("../models/User");
const { findById } = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
      const { userId } = req.body
      const uiduser = JSON.parse(userId)
      console.log(uiduser)
      const isuser = await User.findById(uiduser);
      console.log(isuser.inCompetition)
      if (isuser.inCompetition === true) {
        console.log("the user is in")
      } else {
      try {
        const finduser = await User.findByIdAndUpdate(uiduser, {inCompetition: true});
        console.log(finduser)
        res.status(200).json(finduser);
      } catch (err) {
        res.status(500).json(err);
      }
      }
     
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
   const result = await Order.findByIdAndDelete(req.params.id);
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        res.status(404).json(err);
      }
    }
    res.status(200).json({message: "Order has been deleted..."});
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS
router.get("/find/:userId", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/finda/:id", verifyToken, async (req, res) => {
  console.log(req.params.id)
  const userid = JSON.parse(req.params.id)
  try {
    const orders = await User.findById(userid, { _id: 0, inCompetition: 1}).select('inCompetition');
    console.log(orders)
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await User.find({inCompetition: true},{ _id: 0, username: 1}).select('username monthbalance').sort({monthbalance: -1})
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
