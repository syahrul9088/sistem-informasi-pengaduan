const GoogleStrategy = require('passport-google-oauth20').Strategy
const localStrategy		= require('passport-local').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: 'email' },async (email, password, done) => {
      let user = await User.findOne({ email: email })
      return done(null, user);
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {

        console.log(profile.displayName)

        const newUser = {
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          password: null,
          phoneNumber: null
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    // console.log(user.id)
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    // console.log(id)
    User.findById(id, (err, user) => done(err, user))
  })
}
