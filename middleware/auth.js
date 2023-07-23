const ensureAuth = (req, res, next) => {
   if (req.isAuthenticated()) {
       return next()
   } else {
       res.send("not allawed")
   }
}
const ensureGuest = (req, res, next) => {
   if (req.isAuthenticated()) {
       res.redirect("/dashborad")
   } else {
       next()
   }
}


module.exports = {ensureAuth,ensureGuest}