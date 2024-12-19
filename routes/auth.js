const { FRONT_URL } = require("../const/main")
const router = require("express").Router()
const passport = require("passport")
const { createToken } = require("../lib/Common")

// const fs = require("fs")
// const path = require("path")
// const fileName = "example.txt"
// const filePath = path.join(__dirname, fileName)
// fs.writeFile(
//   filePath,
//   req.user.id + "  " + req.user.type + "  " + process.env.JWT_SECRET,
//   (err) => {
//     if (err) {
//       console.error("Error writing file:", err)
//     } else {
//       console.log(
//         `File "${fileName}" has been created successfully in the same directory.`
//       )
//     }
//   }
// )

router.get(
  "/google",
  (req, res, next) => {
    next() // Pass control to the next middleware (passport.authenticate)
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONT_URL}/LoginScreen`,
  }),
  (req, res) => {
    const token = createToken(res, req.user.id, req.user.type || null)
    res.redirect(`${FRONT_URL}/MainInfoScreen?token=${token}`)
  }
)

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect(`${FRONT_URL}/LoginScreen`)
})

module.exports = router
