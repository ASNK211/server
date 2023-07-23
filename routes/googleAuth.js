const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport")
// const ensureAuth = require("../middleware/auth")
const { ensureAuth, ensureGuest } = require("../middleware/auth")

require('../passport');

const router = express.Router();

const succesLoginUrl = "https://zoolgame.com/"
const errorLoginUrl = "https://zoolgame.com/login/failed"

// const isLoggedIn = (req, res, nex) => {
//   if (req.user) {
//     next();
//   } else {
//     res.status(404)
//   }
// }

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureMessage: "cannot login to google, please try again later",
        failureRedirect: errorLoginUrl,
        successRedirect: succesLoginUrl
    }),
    (req, res) => {
        res.send("thank you for sign in")
    }
)

router.get("/seccess", (req, res) => {
  const sendUser = req.user;
  if(sendUser){
const accessToken = jwt.sign(
    {
      id: sendUser._id,
      isAdmin: sendUser.isAdmin,
    },
    process.env.JWT_SEC,
    { expiresIn: "30d" }
  );
  try {
    return res.status(200).send({sendUser, accessToken})
  } catch (err) {
    res.status(500).json(err);
  }
  }
})
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    seccess: false,
    massage: "failure",
  })
})


router.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err);
  });
});


module.exports = router;