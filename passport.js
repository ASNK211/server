const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/User");

const GOOGLE_CLIENT_ID = "285542797384-1smcmq7hem5tgo37apohn49irf95e687.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_callback_URL = "https://zoolgame.com/api/auth/google/callback"

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_callback_URL,
  // passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
    const defaultUser = {
      username: profile.name.givenName,
      email: profile.emails[0].value,
      googleId: profile.id
    }
    try {
      let user = await User.findOne({ googleId: profile.id })
      if (user) {
        done(null, user)
      } else {
        const googleuser = defaultUser.email.toLowerCase()
        user = await User.create(googleuser)
        done(null, user)
      }
    } catch (error) {
      console.error(error)
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (_id, done) => {
  User.findById(_id, (err , user) => done(err, user))
})
