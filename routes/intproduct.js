const Intproduct = require("../models/intproduct")
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
const router = require("express").Router();
const fs = require("fs")
const multer = require("multer")

//multer middleware
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
  });
  const upload = multer({
    storage: Storage,
  }).single("image");


router.post("/", verifyTokenAndAdmin, async (req,res) => {
 upload(req, res,async function (error) {
    if (error) {
      return res.sendStatus(500);
    }else if (!req.file) {
      res.status(500).json({alert: "please upload image"});
    }else {
    const intproduct = new Intproduct(req.body);
    const imagename = req.file.filename;
    intproduct.image = imagename
    try {
     const saveint = await intproduct.save()
     res.status(200).json({saveint})
    }catch (err) {
    res.status(404).json(err)
    }
    }

  })
})

// //GET ALL

 router.get("/", async(req,res) => {
    try {
        const resint = await Intproduct.find();
        res.status(200).json(resint)
    }catch (err) {
        res.status(404).json(err)
    }
 })
//DELETE
router.delete("/:id",verifyTokenAndAdmin, async (req, res) => {
    const id = req.params.id;
    try {
      const result = await Intproduct.findByIdAndDelete(id);
      if (result.image != "") {
        try {
          fs.unlinkSync("./uploads/" + result.image);
        } catch (err) {
          res.status(404).json(err);
        }
      }
      res.status(200).json({ massage: "Product deleted successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  });

 router.put("/:id",verifyTokenAndAdmin, async (req, res) => {

  upload(req, res,async function (error) {
    if (error) {
      return res.sendStatus(500);
    }
    const id = req.params.id;
    const result = await Intproduct.findById(id);
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        res.status(404).json(err);
      }
    const intProduct = req.body;
    intProduct.image = new_image;
    try {
      await Intproduct.findByIdAndUpdate(id, intProduct);
      res.status(200).json({ massage: "product update successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
    } else {
      // new_image = req.body.old_image;
      const intProduct = JSON.parse(JSON.stringify(req.body));
    try {
     const tt = await Intproduct.findByIdAndUpdate(id, intProduct);
      res.status(200).json({ massage: "product update successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
    }
    
  })
  });
module.exports = router;
