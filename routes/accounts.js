// const accounts = requi/re("../models/accounts");
const Order = require("../models/Order");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const multer = require("multer")
const Joi = require('joi');


const Storage = multer.diskStorage({
  destination: 'upload',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
  },
});
const upload = multer({
  storage: Storage,
}).single("image");

router.post("/", verifyToken, async (req, res) => {
  upload(req, res, async function (error) {
    if (error) {
      console.log(`upload.single error: ${error}`);
      return res.sendStatus(500);
    }else if (!req.file) {
      res.status(404).json({alert: "please upload image for transaction"});
    }else {
  const orderNumber = await Order.find().count()
  const schema =Joi.object({
    amount: Joi.number().integer().required(),
    userId: Joi.string().required(),
    // orderId: Joi.string().required(),
    nameproduct: Joi.string(),
    email: Joi.string(),
})
const validation = schema.validate(req.body); 
console.log(validation)
if (validation.error) {
 return res.status(404).send(validation.error)
}
  const {userId, nameproduct, email, image, amount} =  req.body;
  const newaccount = new Order({
    userId: userId,
    nameproduct: nameproduct,
    email: email,
    image: image,
    amount: amount
})
const imagename = req.file.filename;
newaccount.image = imagename
newaccount.orderNumber = orderNumber
    try {
        const savedAccount = await newaccount.save();
        res.status(200).json({ savedAccount });
    } catch (err) {
        res.status(400).json(err);
    }
    }
  })
});
router.get("/find/:userId",verifyToken, async (req, res) => {
    try {
      const account = await Order.find({ userId: req.params.userId });
      res.status(200).json(account);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.put("/:id",verifyTokenAndAdmin, async (req, res) => {
    try {
      const updatedProduct = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;