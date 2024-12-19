const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User") // Your User model
const { BACKEND_URL } = require("../const/main")

// Serialize user (once user is authenticated and ready to be stored in session)
passport.serializeUser((user, done) => {
  done(null, user.id) // Only store user ID in session
})

// Deserialize user (this is called when a request with a session is received)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id) // Fetch the user from the database using the ID stored in session
    if (!user) {
      return done(new Error("User not found"), null)
    }
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
      callbackURL: BACKEND_URL + "/api/auth/google/callback",
      scope: ["profile", "email"], // Scopes for Google authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        })
        if (!user) {
          // If no user is found, create a new user
          user = await User.create({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            // Add additional properties if necessary
          })
        }

        done(null, user)
      } catch (err) {
        done(err, null) // Pass error to done callback
      }
    }
  )
)

module.exports = passport
