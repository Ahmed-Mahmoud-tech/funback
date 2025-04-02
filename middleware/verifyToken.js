// middleware/verifyToken.js
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.header("Authorization")
  if (!authHeader) {
    return res.status(401).json("Access Denied")
  }

  // Token format should be "Bearer <token>"
  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json("Access Denied")
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    // Attach user data to request object
    console.log(
      verified,
      "verifiedverifiedverifiedverifiedverifiedverifiedverifiedverifiedverifiedverifiedverifiedverifiedverified"
    )
    req.user = verified
    next()
  } catch (err) {
    console.error("Token verification error:", err) // Log the error
    res.status(400).json("Invalid Token")
  }
}

module.exports = {
  verifyToken,
}
