const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User") // Your User model
const fs = require("fs")
const path = require("path")
const fileName = "example.txt"
const filePath = path.join(__dirname, fileName)
// Serialize and deserialize user for session management

passport.deserializeUser(async (id, done) => {
  fs.appendFileSync(filePath, JSON.stringify("user000000000"))
  try {
    const user = await User.findByPk(id) // Find user by ID
    passport.serializeUser((user, done) => {
      done(null, user.id)
    })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

// Google Strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.ENV_STATUS === "production"
          ? "http://localhost:5000/api/auth/google/callback" // Production callback URL
          : "http://localhost:5000/api/auth/google/callback", // Local callback URL
      // callbackURL:
      //   process.env.ENV_STATUS === "production"
      //     ? "https://virtualscene.tech/api/auth/google/callback" // Production callback URL
      //     : "http://localhost:5000/api/auth/google/callback", // Local callback URL
      scope: ["profile", "email"], // The scopes you want for authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        fs.appendFileSync(filePath, JSON.stringify("user000000000"))
        passport.serializeUser((user, done) => {
          fs.appendFileSync(filePath, JSON.stringify(user))

          done(null, user.id)
        })
        console.log(`Authenticating with Google: ${profile.displayName}`)
        // Look for a user by the email address provided by Google
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        })
        if (!user) {
          // If no user is found, create a new user
          user = await User.create({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            // Set additional properties if necessary (e.g., role)
          })
        }

        done(null, user) // Pass user to done callback
      } catch (err) {
        fs.appendFileSync(filePath, JSON.stringify(err) + "a7a")

        done(err, null) // Pass error to done callback
      }
    }
  )
)

module.exports = passport
