const jwt = require("jsonwebtoken")

const createToken = (res, id, type) => {
  const token = jwt.sign(
    {
      id,
      type,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )
  // Set the token in an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production", // Send the cookie over HTTPS in production
    maxAge: 3600000, // 1 hour
    sameSite: "strict", // CSRF protection
  })
}

module.exports = {
  createToken,
}
