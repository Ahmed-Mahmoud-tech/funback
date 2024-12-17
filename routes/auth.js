const fs = require("fs")
const path = require("path")

// Define the file path and content
const fileName = "example.txt"
const filePath = path.join(__dirname, fileName)
const router = require("express").Router()
// const User = require("../models/User")
const passport = require("passport")
const { createToken } = require("../lib/Common")

// Google Auth
router.get(
  "/google",
  (req, res, next) => {
    const content = JSON.stringify({
      headers: req.headers, // Logs request headers
      ip: req.ip, // Logs request IP
      url: req.originalUrl, // Logs the requested URL
      method: req.method, // Logs the HTTP method
      query: req.query, // Logs query parameters
    })

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error writing file:", err)
      } else {
        console.log(
          `File "${fileName}" has been created successfully in the same directory.`
        )
      }
    })
    next() // Pass control to the next middleware (passport.authenticate)
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: `${process.env.FRONT_URL}/profile`,
    failureRedirect: `${process.env.FRONT_URL}/NotificationScreen`,
  }),
  (req, res) => {
    createToken(res, req.user.id, req.user.type || null)
    // setTimeout(() => {
    // res.send("dddddddddddd")
    res.redirect(`${process.env.FRONT_URL}/LoginScreen`)
    // res.redirect(`myapp://LoginScreen?token=${req.user.id}`)
    // res.redirect(`${process.env.FRONT_URL}/profile?userId=${req.user.id}`)
    // }, 1000)
  }
)

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect(`${process.env.FRONT_URL}/login11`)
})

module.exports = router
