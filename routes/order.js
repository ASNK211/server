const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const fs = require("fs")
const multer = require("multer")

//CREATE
const Storage = multer.diskStorage({
  destination: 'upload',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
  },
});
const upload = multer({
  storage: Storage,
}).single("image");

router.post("/", async (req, res) => {
  upload(req, res, async function (error) {
    if (error) {
      return res.sendStatus(500);
    }else if (!req.file) {
      res.status(404).json({alert: "please upload image for transaction"});
    } else {
      const { orders, userId, email, image, trnumber } = req.body
      const orderNumber = await Order.find().count()
      const newOrder = new Order({
        userId: userId,
        order: JSON.parse(orders),
        email: email,
        image: image,
        trunmber: trnumber
    })
      const imagename = req.file.filename;
      newOrder.image = imagename
      newOrder.orderNumber = orderNumber
      try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  })

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
  try {
    const orders = await Order.findById(req.params.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ $natural: -1 }).limit(100);
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
