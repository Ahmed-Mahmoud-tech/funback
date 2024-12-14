// config/passport.js
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/User") // Your User model

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    // Find user by ID using await
    const user = await User.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://virtualscene.tech/api/auth/google/callback" // عنوان الإنتاج
          : "http://localhost:5000/api/auth/google/callback", // عنوان محلي      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value })
        if (!user) {
          console.log(profile, "5222222222222")
          user = await new User({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            // role: "user",
          }).save()
        }

        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }
  )
)
