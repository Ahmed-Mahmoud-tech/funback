const jwt = require("jsonwebtoken")

const createToken = (res, id, type, owner) => {
  const token = jwt.sign(
    {
      id,
      type,
      owner,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  return token
  // Set the token in an HTTP-only cookie
  // res.cookie("token", token, {
  //   httpOnly: false,
  //   secure: process.env.ENV_STATUS !== "stage", // Send the cookie over HTTPS in production
  //   maxAge: 3600000, // 1 hour
  //   sameSite: "strict", // CSRF protection
  // })
}

module.exports = {
  createToken,
}
