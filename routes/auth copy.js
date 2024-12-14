// routes/auth.js
const router = require("express").Router()
const User = require("../models/User")
const passport = require("passport")
const { createToken } = require("../lib/Common")

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: `${process.env.FRONT_URL}/profile`,
    failureRedirect: `${process.env.FRONT_URL}/login`,
  }),
  (req, res) => {
    createToken(res, req.user.id, req.user.type || null)
    setTimeout(() => {
      res.redirect(`myapp://auth?token=${req.user.id}`)
      // res.redirect(`${process.env.FRONT_URL}/profile?userId=${req.user.id}`)
    }, 6000)
  }
)

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect(`${process.env.FRONT_URL}/login`)
})

module.exports = router
