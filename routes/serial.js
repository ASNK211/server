const serial = require("../models/serial");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newserial = new serial(req.body);
    try {
        const savedserial = await newserial.save();
        res.status(200).json(savedserial);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/find/:orderId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const serials = await serial.find({ orderId: req.params.orderId });
        res.status(200).json(serials);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
