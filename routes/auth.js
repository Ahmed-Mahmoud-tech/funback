const { FRONT_URL } = require("../const/main");
const router = require("express").Router();
const passport = require("passport");
const { createToken } = require("../lib/Common");

const { Expo } = require("expo-server-sdk");
const PushToken = require("../models/PushToken");

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
    next(); // Pass control to the next middleware (passport.authenticate)
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONT_URL}/LoginScreen`,
  }),
  (req, res) => {
    const token = createToken(
      res,
      req.user.id,
      req.user.type || null,
      req.user.type == "owner" ? req.user.id || req.user.owner : null
    );
    res.redirect(
      `${FRONT_URL}/MainInfoScreen?token=${token}&&userId=${req.user.id}`
    );
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any logout errors
    }
    res.json("OK");
  });
});

// router.get("/logout", (req, res) => {
//   req.logout()
//   res.redirect(`${FRONT_URL}/LoginScreen`)
// })

router.post("/expoRegister", async (req, res) => {
  const { token } = req.body;
  console.log("000000000000000144444", token);

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    // Check if the token already exists
    const existingToken = await PushToken.findOne({ where: { token } });

    if (existingToken) {
      return res.status(200).json({ message: "Token already registered" });
    }

    // Insert the new token into the database
    await PushToken.create({ token });

    res.status(200).json({ message: "Token registered" });
  } catch (error) {
    console.error("Error registering token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
